import { Theme } from "../../../assets/Theme/Theme1";

export default function SideBar({ active, onChange }) {
  const items = [
    { id: "BasicInfo", label: "المعلومات الاساسية" },
    { id: "Surgery", label: "العمليات الجراحية" },
    { id: "LabTest", label: "التحاليل المخبرية" },
    { id: "Treatment", label: "الوصفات الطبية" },
    { id: "DoctorNote", label: "ملاحظات الاطباء" },
  ];

  return (
    <aside style={S.side}>
      {items.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            ...S.item,
            backgroundColor: active === id ? Theme.accent : "transparent",
            color: active === id ? Theme.textInverse : Theme.textPrimary,
          }}
        >
          {label}
        </button>
      ))}
    </aside>
  );
}

const S = {
  side: {
    width: 220,
    borderLeft: `1px solid ${Theme.border}`,
    backgroundColor: Theme.navBarBackground,
    display: "flex",
    flexDirection: "column",
    boxShadow: "-4px 0 8px rgba(0, 0, 0, 0.1)",
  },
  item: {
    padding: `${Theme.spacing.medium}px ${Theme.spacing.small}px`,
    textAlign: "right",
    border: "none",
    borderBottom: `1px solid ${Theme.border}`,
    background: "none",
    fontSize: Theme.fontSize.normal,
    cursor: "pointer",
    transition: "background-color 150ms",
  },
};
