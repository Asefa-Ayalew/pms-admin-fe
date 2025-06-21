import { useEffect, useState } from "react";

export function useProfile() {
  const [profile, setProfile] = useState();

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (error) {
        console.error("Error parsing profile:", error);
      }
    }
  }, []);

  return profile;
}
