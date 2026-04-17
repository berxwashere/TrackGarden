import { useEffect, useState } from 'react';

// Interface for each day in the weather forecast
interface WeatherDay {
  label: string;
  date: string;
  temp: number;
  icon: string;
  description: string;
  wind: number;
  humidity: number;
}

interface WeatherWidgetProps {
  language: 'TR' | 'ENG';
}

/**
 * WeatherWidget handles the detection of user location and fetching 
 * weather data from the OpenWeatherMap API.
 */
const WeatherWidget = ({ language }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cityName, setCityName] = useState<string>('');
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  /**
   * Fetches weather and city name based on latitude and longitude.
   * Uses OpenWeatherMap API keys from .env (VITE_OPENWEATHER_API_KEY).
   */
  const fetchWeatherAndCity = async (lat: number, lon: number) => {
    setLocationError('');
    setPosition({ lat, lon });
    setCityName('');

    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setError('Weather API key not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file.');
      setLoading(false);
      return;
    }

    try {
      // 5-day / 3-hour forecast API
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=${language === 'TR' ? 'tr' : 'en'}&cnt=24&appid=${apiKey}`
      );
      if (!response.ok) throw new Error('Weather fetch failed');
      const data = await response.json();

      setCityName(data.city?.name || `${lat.toFixed(2)}, ${lon.toFixed(2)}`);

      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfter = new Date(today);
      dayAfter.setDate(today.getDate() + 2);

      const formatDate = (date: Date) => {
        return date.toLocaleDateString();
      };

      // Find forecast item closest to 09:00 AM for predictive accuracy
      const findNineAM = (targetDate: Date) => {
        const targetYear = targetDate.getFullYear();
        const targetMonth = (targetDate.getMonth() + 1).toString().padStart(2, '0');
        const targetDay = targetDate.getDate().toString().padStart(2, '0');
        const targetDateTime = `${targetYear}-${targetMonth}-${targetDay} 09:00:00`;

        return data.list.find((item: any) => item.dt_txt === targetDateTime);
      };

      const todayWeather = data.list[0];
      const tomorrowWeather = findNineAM(tomorrow) || data.list.find((item: any) => item.dt_txt?.startsWith(`${tomorrow.getFullYear()}-${(tomorrow.getMonth() + 1)
        .toString().padStart(2, '0')}-${tomorrow.getDate().toString().padStart(2, '0')}`));
      const dayAfterWeather = findNineAM(dayAfter) || data.list.find((item: any) => item.dt_txt?.startsWith(`${dayAfter.getFullYear()}-${(dayAfter.getMonth() + 1)
        .toString().padStart(2, '0')}-${dayAfter.getDate().toString().padStart(2, '0')}`));

      const days = [
        {
          label: language === 'TR' ? 'Bugün' : 'Today',
          date: formatDate(today),
          temp: Math.round(todayWeather.main.temp),
          icon: todayWeather.weather[0].icon,
          description: todayWeather.weather[0].description,
          wind: Math.round(todayWeather.wind.speed),
          humidity: todayWeather.main.humidity,
        },
        {
          label: language === 'TR' ? 'Yarın' : 'Tomorrow',
          date: formatDate(tomorrow),
          temp: Math.round(tomorrowWeather?.main?.temp || 20),
          icon: tomorrowWeather?.weather?.[0]?.icon || '02d',
          description: tomorrowWeather?.weather?.[0]?.description || 'Partly cloudy',
          wind: Math.round(tomorrowWeather?.wind?.speed || 0),
          humidity: tomorrowWeather?.main?.humidity || 0,
        },
        {
          label: language === 'TR' ? 'Ertesi Gün' : 'Next Day',
          date: formatDate(dayAfter),
          temp: Math.round(dayAfterWeather?.main?.temp || 18),
          icon: dayAfterWeather?.weather?.[0]?.icon || '03d',
          description: dayAfterWeather?.weather?.[0]?.description || 'Scattered clouds',
          wind: Math.round(dayAfterWeather?.wind?.speed || 0),
          humidity: dayAfterWeather?.main?.humidity || 0,
        },
      ];
      setWeather(days);
    } catch (err) {
      setError('Unable to load weather.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initiate geolocation sequence on mount
    const getGeolocation = () => {
      if (!navigator.geolocation) {
        setLocationError(
          language === 'TR'
            ? 'Hava durumu bu tarayıcıda desteklenmiyor.'
            : 'Geolocation is not supported by this browser.'
        );
        setLoading(false);
        return;
      }

      // Delayed Error Reporting (2s):
      // Ensures "Loading..." state is visible for a smooth UX before showing help messages.
      const timer = setTimeout(() => {
        setLocationError(
          language === 'TR'
            ? 'Konum erişimi engellendi. Tarayıcı adres çubuğundan konum izni verin ve sayfayı yenileyin.'
            : 'Location access is blocked. Allow location from the browser address bar, then refresh the page.'
        );
        setLoading(false);
      }, 2000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timer);
          const { latitude, longitude } = position.coords;
          setLocationError('');
          fetchWeatherAndCity(latitude, longitude);
        },
        (error) => {
          // Fallback logic for non-permission errors
          console.log('Initial geoloc error:', error.code);

          // Code 1 = Permission Denied (Handled by the 2s timer above)
          // Others = Fallback to Istanbul default
          if (error.code !== 1) {
            clearTimeout(timer);
            setLocationError(
              language === 'TR'
                ? 'Konumunuz okunamadı. Şimdilik varsayılan olarak İstanbul kullanılıyor.'
                : 'Unable to read your location. Using Istanbul as default for now.'
            );
            setCityName('Istanbul');
            fetchWeatherAndCity(41.0082, 28.9784);
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    getGeolocation();
  }, [language]);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-soft flex flex-col h-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-base uppercase tracking-[0.22em] text-emerald-600">
            {language === 'TR' ? 'Hava Durumu' : 'Weather'}
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            {cityName ||
              (position
                ? `${position.lat.toFixed(2)}, ${position.lon.toFixed(2)}`
                : language === 'TR'
                  ? 'Konumunuz'
                  : 'Your Location')}
          </h2>
        </div>
        {loading ? <span className="text-sm text-slate-500">Loading...</span> : null}
      </div>

      {error ? <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      {locationError && !loading ? (
        <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-700">{locationError}</p>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3 flex-1">
        {weather.length > 0 ? (
          weather.map((day) => (
            <article key={day.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{day.label}</p>
                  <p className="text-xs text-slate-500">{day.date}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 shadow-sm ring-1 ring-slate-200">
                  <img
                    className="h-10 w-10"
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.description}
                  />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{day.temp}°C</p>
              <p className="mt-2 text-sm text-slate-700">
                {language === 'TR' ? 'Rüzgar Hızı' : 'Wind Speed'}: {day.wind} m/s
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {language === 'TR' ? 'Nem Oranı' : 'Humidity'}: {day.humidity}%
              </p>
              <p className="mt-4 text-sm font-semibold text-slate-700 capitalize">{day.description}</p>
            </article>
          ))
        ) : !loading ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400">
            <p className="text-lg font-medium">{language === 'TR' ? 'Konum İzni Yok' : 'No Location Permission'}</p>
            <p className="text-sm">{language === 'TR' ? 'Hava durumunu görmek için konum erişimine izin verin.' : 'Please allow location access to see the weather.'}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default WeatherWidget;
