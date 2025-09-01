import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { getSessionId } from '../utils/session';

const ITEMS_PER_PAGE = 10;

const MyRequests = () => {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedRequests, setExpandedRequests] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});

  // ---------------- Helper: Build Firestore Query ----------------
  const buildQuery = useCallback((isLoadMore = false) => {
    const sessionId = getSessionId();

    if(!sessionId) {
      throw new Error('Session ID not found. Cannot fetch you requests');
    }
    const constraints = [where('sessionId', '==', sessionId)];

    if (statusFilter !== 'all') {
      constraints.push(where('status', '==', statusFilter));
    }

    constraints.push(orderBy('timestamp', 'desc'));

    if (isLoadMore && lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    constraints.push(limit(ITEMS_PER_PAGE));

    return query(collection(db, 'requests'), ...constraints);
  }, [statusFilter, lastDoc]);

  // ---------------- Fetch Requests ----------------
  const fetchMyRequests = useCallback(async (isLoadMore = false) => {
    try {
      isLoadMore ? setLoadingMore(true) : setLoading(true);
      setError(null);

      const sessionId = getSessionId();
      const cacheKey = `${sessionId}_${statusFilter}_${isLoadMore ? 'more' : 'initial'}`;

      // Use cache for initial fetch
      if (cache[cacheKey] && !isLoadMore) {
        setRequests(cache[cacheKey].requests);
        setLastDoc(cache[cacheKey].lastDoc);
        setHasMore(cache[cacheKey].hasMore);
        setLoading(false);
        return;
      }

      const q = buildQuery(isLoadMore);
      const snapshot = await getDocs(q);

      const newRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (isLoadMore) {
        setRequests(prev => [...prev, ...newRequests]);
      } else {
        setRequests(newRequests);
      }

      const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
      const newHasMore = snapshot.docs.length === ITEMS_PER_PAGE;

      setLastDoc(newLastDoc);
      setHasMore(newHasMore);

      // Cache results for initial fetch
      if (!isLoadMore) {
        setCache(prev => ({
          ...prev,
          [cacheKey]: { requests: newRequests, lastDoc: newLastDoc, hasMore: newHasMore }
        }));
      }
    } catch (err) {
      console.error('Error fetching my requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
    
  }, [buildQuery, statusFilter, cache]);

  // ---------------- Update Request Status ----------------
  const markAsCompleted = async (requestId) => {
    try {
      setUpdatingStatus(requestId);
      setError(null);

      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'completed',
        completedAt: new Date()
      });

      // Update local state
      setRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status: 'completed', completedAt: new Date() } : r)
      );

      // Clear cache to force fresh fetch
      setCache({});
    } catch (err) {
      console.error('Error updating request status:', err);
      setError(err.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ---------------- Toggle Expanded ----------------
  const toggleExpanded = (requestId) => {
    setExpandedRequests(prev => {
      const newSet = new Set(prev);
      newSet.has(requestId) ? newSet.delete(requestId) : newSet.add(requestId);
      return newSet;
    });
  };

  // ---------------- Format Helpers ----------------
  const formatTimestamp = (timestamp) => timestamp?.toDate ? timestamp.toDate().toLocaleString() : new Date(timestamp).toLocaleString();
  const getHelpTypeLabel = (type) => ({
    medical: t('medical'),
    food: t('food'),
    shelter: t('shelter'),
    emergencyTransport: t('emergencyTransport')
  }[type] || type);
  const getStatusLabel = (status) => ({
    pending: t('pending'),
    completed: t('completed')
  }[status] || status);
  const getStatusColor = (status) => ({
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800'
  }[status] || 'bg-gray-100 text-gray-800');

  // ---------------- Handlers ----------------
  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setLastDoc(null);
    setHasMore(true);
    setExpandedRequests(new Set());
    setError(null);
  };

  const loadMore = () => hasMore && !loadingMore && fetchMyRequests(true);
  const retryFetch = () => { setError(null); fetchMyRequests(); };

  // ---------------- Initial Fetch ----------------
  useEffect(() => { fetchMyRequests(); }, [statusFilter, getSessionId]);

  // ---------------- Render ----------------
  if (loading) return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('myRequests')}</h2>
      <div className="text-center py-8 text-gray-500">{t('loading')}</div>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('myRequests')}</h2>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex justify-between items-center">
          <span>{t('errorLoading')}: {error}</span>
          <button onClick={retryFetch} className="text-red-800 underline text-sm">{t('retry')}</button>
        </div>
      )}

      {/* Status Filter */}
      <div className="mb-4 flex gap-2">
        {['all','pending','completed'].map(s => (
          <button
            key={s}
            onClick={() => handleStatusFilterChange(s)}
            className={`px-3 py-1 text-sm rounded-md ${statusFilter === s ? (s==='pending'?'bg-yellow-500 text-white':s==='completed'?'bg-green-500 text-white':'bg-blue-500 text-white') : 'bg-gray-200 text-gray-700'}`}
          >
            {t(s)}
          </button>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t('noRequests')}</div>
      ) : (
        <div className="space-y-4">
          {requests.map(r => (
            <div key={r.id} className="border border-gray-200 rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-gray-500">{formatTimestamp(r.timestamp)}</div>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <div>{r.location}</div>
                <div>{getHelpTypeLabel(r.typeOfHelp)}</div>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(r.status)}`}>
                  {getStatusLabel(r.status)}
                </span>
                {r.status === 'pending' && (
                  <button
                    onClick={() => markAsCompleted(r.id)}
                    disabled={updatingStatus === r.id}
                    className="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                  >
                    {updatingStatus === r.id ? t('updating') : t('markCompleted')}
                  </button>
                )}
              </div>

              {expandedRequests.has(r.id) && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                  <div className="mb-2"><strong>{t('contactNumber')}:</strong> {r.contactNumber}</div>
                  <div><strong>{t('description')}:</strong> {r.description}</div>
                  {r.completedAt && <div className="mt-2 text-green-600"><strong>{t('completedAt')}:</strong> {formatTimestamp(r.completedAt)}</div>}
                </div>
              )}

              <button onClick={() => toggleExpanded(r.id)} className="mt-2 text-blue-600 text-sm hover:underline">
                {expandedRequests.has(r.id) ? 'Hide Details' : t('clickToViewDetails')}
              </button>
            </div>
          ))}

        
          
        </div>
      )}
    </div>
  );
};

export default MyRequests;
