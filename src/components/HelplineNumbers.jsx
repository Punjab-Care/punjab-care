import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useLanguage } from "../contexts/LanguageContext"; // keep your existing context path

const HelplineNumbers = () => {
  const { language, t } = useLanguage(); // "en" / "pa"
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [rawHelplines, setRawHelplines] = useState([]); // raw docs from firestore
  const [helplines, setHelplines] = useState([]); // mapped to selected language
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingHelplines, setLoadingHelplines] = useState(false);

  // 1) Fetch unique top-level districts (canonical field) — DO NOT localize dropdown here
  useEffect(() => {
    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const snap = await getDocs(collection(db, "helplines"));
        const unique = new Set();
        snap.forEach((doc) => {
          const d = doc.data();
          // prefer top-level district (canonical English key). Fallback to language.en.district if absent.
          const canonical = d.district || d.language?.en?.district || null;
          if (canonical) unique.add(canonical);
        });
        setDistricts(Array.from(unique).sort());
      } catch (err) {
        console.error("Error fetching districts:", err);
      } finally {
        setLoadingDistricts(false);
      }
    };
    fetchDistricts();
  }, []); // only once

  // 2) Fetch helplines: only when a district is selected -> state-wide + district-specific
  useEffect(() => {
    const fetchHelplines = async () => {
      // If no district selected, show nothing
      if (!selectedDistrict) {
        setRawHelplines([]);
        return;
      }

      setLoadingHelplines(true);
      try {
        let allDocs = [];
        
        // Fetch state-wide helplines (isStateWide: true)
        const stateWideQuery = query(
          collection(db, "helplines"),
          where("isStateWide", "==", true)
        );
        const stateWideSnap = await getDocs(stateWideQuery);
        const stateWideDocs = stateWideSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        allDocs = [...stateWideDocs];
        
        // Also fetch district-specific helplines (isStateWide: false) for the selected district
        const districtQuery = query(
          collection(db, "helplines"),
          where("district", "==", selectedDistrict),
          where("isStateWide", "==", false)
        );
        const districtSnap = await getDocs(districtQuery);
        const districtDocs = districtSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        allDocs = [...allDocs, ...districtDocs];
        
        setRawHelplines(allDocs);
      } catch (err) {
        console.error("Error fetching helplines:", err);
        setRawHelplines([]);
      } finally {
        setLoadingHelplines(false);
      }
    };

    fetchHelplines();
  }, [selectedDistrict]);

  // 3) Map raw docs -> display items whenever rawHelplines or language changes
  useEffect(() => {
    const mapped = rawHelplines.map((d) => ({
      id: d.id,
      contact: d.contact || d.phone || d.contactNumber || "N/A",
      // show orgName from selected language, fallback to top-level orgName if any
      orgName: d.language?.[language]?.orgName || d.orgName || d.name || "N/A",
      // optionally show localized district for card (but dropdown remains canonical)
      districtDisplay: d.language?.[language]?.district || d.district || "",
      raw: d, // keep raw in case you need it later
    }));
    setHelplines(mapped);
  }, [rawHelplines, language]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">{t('helplineNumbers')}</h2>

      {/* District Dropdown (canonical values; stays same when language toggles) */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">{t('selectDistrict')}</label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
        >
          <option value="">{t('selectDistrict')}</option>
          {loadingDistricts ? (
            <option>{t('loading')}</option>
          ) : (
            districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Helpline list */}
      {loadingHelplines ? (
        <p className="text-sm text-gray-600">{t('loading')}</p>
      ) : helplines.length === 0 ? (
        <p className="text-sm text-gray-600">{t('noHelplinesFound')}</p>
      ) : (
        <ul className="space-y-3">
          {helplines.map((h) => (
            <li
              key={h.id}
              className="border rounded p-3 shadow hover:shadow-md transition"
            >
              <p className="font-semibold">{h.orgName}</p>
              {h.districtDisplay && (
                <p className="text-sm text-gray-600">{h.districtDisplay}</p>
              )}
              <p className="text-sm">
                📞 <a href={`tel:${h.contact}`}>{h.contact}</a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HelplineNumbers;
