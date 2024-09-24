import { headers } from "next/headers";

// Define the location data structure (i.e the response from the API)
interface LocationData {
  ip: string;
  city: string;
  country: string;
  hostname: string;
  loc: string;
  org: string;
  postal: string;
  region: string;
  timezone: string;
}

/**
 * @author Benjamin Davies
 *
 * @description
 * This function grabs the user IP from the headers and then fetches the user's location details from an external API. Extern API used is ipinfo.io and supports 50,000 requests per month for free.
 *
 * @returns
 * The user's location details Ip, City, Country, Hostname, Location, Orgin, Postal, Region, Timezone
 */
export async function getUserLocation() {
  // Get the IP address from the request
  const reqHeaders = headers();
  const ip = reqHeaders.get("x-forwarded-for") ?? "unknown";

  // Fetch location details from an external API
  const response = await fetch(
    `https://ipinfo.io/${ip}/json?token=82e35d002b181d`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch location");
  }

  const locationData: LocationData = (await response.json()) as LocationData;

  return {
    ip: locationData.ip,
    location: {
      city: locationData.city,
      country: locationData.country,
      hostname: locationData.hostname,
      loc: locationData.loc,
      org: locationData.org,
      postal: locationData.postal,
      region: locationData.region,
      timezone: locationData.timezone,
    },
  };
}

/* 
CLIENT SIDE IMPLEMENTATION


const [userAgent, setUserAgent] = useState("");
  const [operatingSystem, setOperatingSystem] = useState("");

  useEffect(() => {
    setUserAgent(navigator.userAgent);
    setOperatingSystem(navigator.platform);
  }, []);

  // Move the mutation to the top and use it correctly
  const mutation = api.user.login.useMutation();



const wallet = "0x17F683a6d8fba5Fd49D36ed9AfaF032654D0E24a";

  // Call your API when the userAgent or operatingSystem is ready
  const handleLogin = async () => {
    try {
      await mutation.mutateAsync({
        walletId: wallet,
        browser: userAgent,
        operatingSystem: operatingSystem,
        location: locationData.city + ", " + locationData.country,
      });
      console.log("Login successful");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };


  <button onClick={handleLogin}>Login</button>


*/
