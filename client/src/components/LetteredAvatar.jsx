const getInitials = (name = "??") => {
  const parts = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.replace(/[^a-zA-Z0-9]/g, ""));
  if (parts.length < 2) return parts[0][0] || "??";
  return `${parts[0][0]}${parts[1][0]}`;
};

const generateBackground = (name = "") => {
  if (!name) return "#000";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const LetteredAvatar = ({ name = "Unknown" }) => {
  const initials = getInitials(name);
  const color = generateBackground(name);
  const customStyle = {
    display: "flex",
    height: "50px",
    width: "50px",
    borderRadius: "100%",
    color: "white",
    background: color,
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={customStyle}>
      <span>{initials}</span>
    </div>
  );
};

export default LetteredAvatar;
