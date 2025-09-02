import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useLanguage } from "../contexts/LanguageContext";
import { getSessionId } from "../utils/session";
import toast from "react-hot-toast";

const RequestHelpForm = () => {
  const { t } = useLanguage();

  // ✅ Centralized help types with proper translation keys
  const helpTypes = [
    { value: "medical", label: t("helpTypes.medical") },
    { value: "food", label: t("helpTypes.food") },
    { value: "shelter", label: t("helpTypes.shelter") },
    { value: "emergencyTransport", label: t("helpTypes.emergencyTransport") },
    { value: "mosquitoNetTarpaulin", label: t("helpTypes.mosquitoNetTarpaulin") },
    { value: "animalFeedMedicine", label: t("helpTypes.animalFeedMedicine") },
  ];

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactNumber: "",
    typeOfHelp: [],
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.location?.trim()) {
      return { valid: false, error: t("locationRequired") };
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      return { valid: false, error: t("invalidContactNumber") };
    }
    if (!formData.typeOfHelp.length) {
      return { valid: false, error: t("typeOfHelpRequired") };
    }
    return { valid: true, error: null };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    const { valid, error: validationError } = validateForm();
    if (!valid) {
      setError(validationError);
      toast.error(validationError);
      setTimeout(() => setError(null), 5000);
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionId = getSessionId();
      const requestData = {
        ...formData,
        sessionId,
        timestamp: new Date(),
        status: "pending",
      };

      await addDoc(collection(db, "requests"), requestData);

      const successMsg = t("requestSubmitted");
      setMessage(successMsg);
      toast.success(successMsg);

      setFormData({
        name: "",
        location: "",
        contactNumber: "",
        typeOfHelp: [],
        description: "",
      });

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Request submission error:", err);
      let errMsg = `${t("errorSubmitting")}: ${err.message}`;
      setError(errMsg);
      toast.error(errMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{t("requestHelp")}</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <div className="font-medium">{t("error")}</div>
          <div className="text-sm">{error}</div>
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">{t("name")}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder={t("name")}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1">{t("location")}</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="flex-1 p-3 border border-gray-300 rounded-md"
              placeholder={t("location")}
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  toast.loading(t('fetchingLocation'), { id: 'loc' });
                  const position = await new Promise((resolve, reject) => {
                    if (!navigator.geolocation) {
                      reject(new Error('Geolocation not supported'));
                      return;
                    }
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                      enableHighAccuracy: true,
                      timeout: 15000,
                      maximumAge: 0,
                    });
                  });
                  const { latitude, longitude, accuracy } = position.coords;
                  // Reverse geocode via OpenStreetMap Nominatim (no key required)
                  let humanReadable = '';
                  try {
                    const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                    const data = await resp.json();
                    const a = data.address || {};
                    const parts = [a.suburb || a.village || a.hamlet || a.neighbourhood || a.locality, a.city || a.town || a.county, a.state];
                    humanReadable = parts.filter(Boolean).join(', ');
                  } catch (_) {
                    // ignore reverse geocode failure, fallback to coords
                  }
                  const display = humanReadable
                    ? humanReadable
                    : t('near');
                  setFormData((prev) => ({ ...prev, location: display }));
                  toast.success(t('locationFetched'), { id: 'loc' });
                  if (accuracy > 50) {
                    toast(t('lowAccuracyWarning'));
                  }
                } catch (err) {
                  console.error('Location error', err);
                  const errMsg = err.code === 1
                    ? t('locationPermissionDenied')
                    : err.code === 2
                    ? t('locationUnavailable')
                    : err.code === 3
                    ? t('locationTimeout')
                    : t('locationError');
                  toast.error(errMsg, { id: 'loc' });
                }
              }}
              className="px-3 py-2 bg-blue-500 text-white rounded-md whitespace-nowrap"
            >
              {t('getLocation')}
            </button>
          </div>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium mb-1">{t("contactNumber")}</label>
          <input
            type="tel"
            inputMode="numeric"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 10);
              setFormData((prev) => ({ ...prev, contactNumber: onlyNums }));
            }}
            maxLength="10"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder={t("contactPlaceholder")}
          />
        </div>

        {/* Help Types */}
        <div>
          <label className="block text-sm font-medium mb-1">{t("typeOfHelp")}</label>
          <div className="space-y-2">
            {helpTypes.map((type) => (
              <label key={type.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={type.value}
                  checked={formData.typeOfHelp.includes(type.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData((prev) => ({
                        ...prev,
                        typeOfHelp: [...prev.typeOfHelp, type.value],
                      }));
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        typeOfHelp: prev.typeOfHelp.filter((v) => v !== type.value),
                      }));
                    }
                  }}
                  className="h-4 w-4"
                />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">{t("description")}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder={t("description")}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 text-white py-3 rounded-md font-medium disabled:opacity-50"
        >
          {isSubmitting ? t("loading") : t("submit")}
        </button>
      </form>
    </div>
  );
};

export default RequestHelpForm;
