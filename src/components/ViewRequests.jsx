import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';

const ViewRequests = () => {
  const { t } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [expandedRequests, setExpandedRequests] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const BATCH_SIZE = 10;

  // Build Firestore query dynamically
  const buildRequestsQuery = (isLoadMore = false) => {
    const requestsRef = collection(db, 'requests');
    const constraints = [];

    if (statusFilter !== 'all') {
      constraints.push(where('status', '==', statusFilter));
    }

    constraints.push(orderBy('timestamp', 'desc'));

    if (isLoadMore && lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    if (!showAll) {
      constraints.push(limit(BATCH_SIZE));
    }

    return query(requestsRef, ...constraints);
  };

  const fetchRequests = async (isLoadMore = false) => {
    try {
      setLoadingMore(isLoadMore);

      const q = buildRequestsQuery(isLoadMore);
      const snapshot = await getDocs(q);

      const newRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (isLoadMore) {
        setRequests(prev => [...prev, ...newRequests]);
      } else {
        setRequests(newRequests);
      }

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(!showAll && snapshot.docs.length === BATCH_SIZE);

      // --------- TEST LOG ---------

      // ----------------------------
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadAllRequests = async () => {
    try {
      setShowAll(true);
      setLoading(true);

      const q = buildRequestsQuery(false); // No pagination, fetch all
      const snapshot = await getDocs(q);

      const allRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRequests(allRequests);
      setHasMore(false);

      // --------- TEST LOG ---------
    
      // ----------------------------
    } catch (error) {
      console.error('Error loading all requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (requestId) => {
    setExpandedRequests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(requestId)) newSet.delete(requestId);
      else newSet.add(requestId);
      return newSet;
    });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
  };

  const getHelpTypeLabel = (type) => {
    const helpTypes = {
      medical: t('medical'),
      food: t('food'),
      shelter: t('shelter'),
      emergencyTransport: t('emergencyTransport')
    };
    return helpTypes[type] || type;
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: t('pending'),
      completed: t('completed')
    };
    return statusLabels[status] || status;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setLastDoc(null);
    setHasMore(true);
    setExpandedRequests(new Set());
    setShowAll(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">{t('viewRequests')}</h2>
        <div className="text-center py-8">
          <div className="text-gray-500">{t('loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t('viewRequests')}</h2>

      {/* Status Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          {['all', 'pending', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(status)}
              className={`px-3 py-1 text-sm rounded-md ${
                statusFilter === status
                  ? status === 'all' ? 'bg-blue-500 text-white' :
                    status === 'pending' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {t(status)}
            </button>
          ))}
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t('noRequests')}</div>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request.id} className="border border-gray-200 rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium">{request.name}</div>
                <div className="text-sm text-gray-500">{formatTimestamp(request.timestamp)}</div>
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <div>{request.location}</div>
                <div>{getHelpTypeLabel(request.typeOfHelp)}</div>
              </div>

              <div className="mb-2">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>

              {expandedRequests.has(request.id) && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                  <div className="mb-2"><strong>{t('contactNumber')}:</strong> {request.contactNumber}</div>
                  <div><strong>{t('description')}:</strong> {request.description}</div>
                  {request.completedAt && (
                    <div className="mt-2 text-green-600"><strong>{t('completedAt')}:</strong> {formatTimestamp(request.completedAt)}</div>
                  )}
                </div>
              )}

              <button
                onClick={() => toggleExpanded(request.id)}
                className="mt-2 text-blue-600 text-sm hover:underline"
              >
                {expandedRequests.has(request.id) ? 'Hide Details' : t('clickToViewDetails')}
              </button>
            </div>
          ))}

          {!showAll && hasMore && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => fetchRequests(true)}
                disabled={loadingMore}
                className="flex-1 bg-blue-500 text-white py-2 rounded-md disabled:opacity-50"
              >
                {loadingMore ? t('loading') : t('loadMore')}
              </button>
              <button
                onClick={loadAllRequests}
                className="flex-1 bg-gray-500 text-white py-2 rounded-md"
              >
                {t('loadAll')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewRequests;
