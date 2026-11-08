/**
 * Formats any ISO date string or Date object to DD/MM/YYYY
 * Handles YYYY-MM-DD directly to prevent unwanted timezone shifts.
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "";
  
  if (typeof dateInput === "string" && dateInput.includes("-")) {
    const clean = dateInput.split("T")[0];
    const parts = clean.split("-");
    if (parts.length === 3 && parts[0].length === 4) {
      const [year, month, day] = parts;
      return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }
  }

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

