type Field<T> = { key: keyof T & string; label: string; multiline?: boolean };
type Props<T extends Record<string, string>> = {
  title: string; items: T[]; fields: Field<T>[]; empty: T; onChange: (items: T[]) => void;
};

export default function ListEditor<T extends Record<string, string>>({ title, items, fields, empty, onChange }: Props<T>) {
  const update = (i: number, k: keyof T & string, v: string) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  return (
    <div className="edit-block">
      <h2>{title}</h2>
      {items.map((it, i) => (
        <div key={i} className="edit-item">
          {fields.map((f) => (
            <label key={f.key}>{f.label}
              {f.multiline
                ? <textarea value={it[f.key]} onChange={(e) => update(i, f.key, e.target.value)} />
                : <input value={it[f.key]} onChange={(e) => update(i, f.key, e.target.value)} />}
            </label>
          ))}
          <button className="btn ghost" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>Remover</button>
        </div>
      ))}
      <button className="btn ghost" onClick={() => onChange([...items, { ...empty }])}>+ Adicionar</button>
    </div>
  );
}
