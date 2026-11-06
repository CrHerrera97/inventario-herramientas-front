import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Boxes,
  Building2,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  CircleGauge,
  ClipboardList,
  Clock3,
  HardHat,
  IdCard,
  ImagePlus,
  LayoutDashboard,
  Maximize2,
  Menu,
  PackageCheck,
  Phone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  ToolCase,
  Trash2,
  Upload,
  UserRound,
  Users,
  Warehouse,
  Wrench,
  X,
} from "lucide-react";

type Page = "dashboard" | "inventory" | "dispatch" | "projects" | "responsibles" | "movements";
type AssetPhoto = {
  id: string;
  url: string;
  description: string;
  kind: "General" | "Identificación" | "Accesorios" | "Novedad";
};
type Asset = {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serial: string;
  acquired: string;
  location: string;
  status: "Disponible" | "En uso" | "Mantenimiento";
  photos: AssetPhoto[];
};
type Project = { name: string; code: string; status: "Activa" | "Finalizada"; manager: string };
type Responsible = {
  id: number;
  name: string;
  identification: string;
  role: string;
  phone: string;
  project: string;
  status: "Activo" | "Inactivo";
};
type MovementDetails = {
  deliveredBy: string;
  receivedBy: string;
  movementDate: string;
  observations: string;
  accessoriesVerified: boolean;
};
type Movement = {
  id: number;
  date: string;
  type: "Entrada a bodega" | "Despacho a obra" | "Devolución a bodega" | "Traslado entre obras";
  assetId: string;
  assetName: string;
  origin: string;
  destination: string;
  deliveredBy: string;
  receivedBy: string;
  observations: string;
  accessoriesVerified: boolean;
};

const projectsSeed: Project[] = [
  { name: "Arawak", code: "OB-024", status: "Activa", manager: "Carlos Mendoza" },
  { name: "Mediterrane Royal", code: "OB-031", status: "Activa", manager: "Laura Pérez" },
  { name: "Obra Norte", code: "OB-038", status: "Activa", manager: "Andrés Ruiz" },
  { name: "Obra Sur", code: "OB-019", status: "Finalizada", manager: "María Torres" },
];

const responsibleSeed: Responsible[] = [
  {
    id: 1,
    name: "Juan Pérez",
    identification: "79.458.210",
    role: "Jefe de bodega",
    phone: "310 555 0142",
    project: "Bodega principal",
    status: "Activo",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    identification: "80.913.674",
    role: "Almacenista",
    phone: "315 555 0187",
    project: "Bodega principal",
    status: "Activo",
  },
  {
    id: 3,
    name: "Andrés Gómez",
    identification: "1.023.451.892",
    role: "Responsable de obra",
    phone: "300 555 0221",
    project: "Arawak",
    status: "Activo",
  },
  {
    id: 4,
    name: "Pedro Martínez",
    identification: "98.745.321",
    role: "Responsable de obra",
    phone: "311 555 0194",
    project: "Mediterrane Royal",
    status: "Activo",
  },
  {
    id: 5,
    name: "Sofía Herrera",
    identification: "",
    role: "Supervisora SST",
    phone: "320 555 0168",
    project: "Obra Norte",
    status: "Inactivo",
  },
];

const drillPhotos: AssetPhoto[] = [
  {
    id: "photo-general",
    url: "https://images.unsplash.com/photo-1689935421853-cb23a0bc92e4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900",
    description: "Vista general de la herramienta y su cable de alimentación.",
    kind: "General",
  },
  {
    id: "photo-model",
    url: "https://images.unsplash.com/photo-1518709414768-a88981a4515d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900",
    description: "Detalle de marca, modelo y estado exterior.",
    kind: "Identificación",
  },
  {
    id: "photo-chuck",
    url: "https://images.unsplash.com/photo-1744302448929-1070a016ce66?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900",
    description: "Detalle del mandril y accesorios de sujeción.",
    kind: "Accesorios",
  },
];

const assetSeed: Asset[] = [
  [
    "RT-001",
    "Taladro rotomartillo",
    "Eléctrica",
    "Bosch",
    "GBH 2-26",
    "12345",
    "2023-02-14",
    "Bodega principal",
    "Disponible",
  ],
  [
    "RT-002",
    "Taladro rotomartillo",
    "Eléctrica",
    "Bosch",
    "GBH 2-26",
    "12346",
    "2023-02-14",
    "Arawak",
    "En uso",
  ],
  [
    "RT-003",
    "Taladro rotomartillo",
    "Eléctrica",
    "Makita",
    "HR2470",
    "12347",
    "2023-06-08",
    "Mediterrane Royal",
    "En uso",
  ],
  [
    "RT-004",
    "Taladro rotomartillo",
    "Eléctrica",
    "Bosch",
    "GBH 2-26",
    "12348",
    "2024-01-10",
    "Bodega principal",
    "Disponible",
  ],
  [
    "RT-005",
    "Taladro rotomartillo",
    "Eléctrica",
    "DeWalt",
    "D25133K",
    "12349",
    "2024-01-10",
    "Bodega principal",
    "Disponible",
  ],
  [
    "ET-001",
    "Escalera Transformer",
    "Escaleras",
    "Little Giant",
    "M17",
    "LT8812",
    "2022-09-20",
    "Arawak",
    "En uso",
  ],
  [
    "ET-002",
    "Escalera Transformer",
    "Escaleras",
    "Little Giant",
    "M17",
    "LT8813",
    "2022-09-20",
    "Bodega principal",
    "Disponible",
  ],
  [
    "ET-003",
    "Escalera Transformer",
    "Escaleras",
    "Werner",
    "MT-22",
    "WE2019",
    "2023-11-02",
    "Bodega principal",
    "Disponible",
  ],
  [
    "PU-001",
    "Pulidora angular",
    "Eléctrica",
    "Makita",
    "GA4530",
    "MK4011",
    "2023-03-17",
    "Bodega principal",
    "Disponible",
  ],
  [
    "PU-002",
    "Pulidora angular",
    "Eléctrica",
    "Bosch",
    "GWS 9-125",
    "BS7721",
    "2023-03-17",
    "Obra Norte",
    "En uso",
  ],
  [
    "PU-003",
    "Pulidora angular",
    "Eléctrica",
    "Makita",
    "GA4530",
    "MK4013",
    "2023-03-17",
    "Arawak",
    "En uso",
  ],
  [
    "PU-004",
    "Pulidora angular",
    "Eléctrica",
    "DeWalt",
    "DWE4120",
    "DW5524",
    "2024-02-02",
    "Arawak",
    "En uso",
  ],
  [
    "AR-001",
    "Arnés de seguridad",
    "Seguridad",
    "3M",
    "Protecta",
    "PR3011",
    "2024-04-12",
    "Bodega principal",
    "Disponible",
  ],
  [
    "AR-002",
    "Arnés de seguridad",
    "Seguridad",
    "3M",
    "Protecta",
    "PR3012",
    "2024-04-12",
    "Bodega principal",
    "Disponible",
  ],
  [
    "AR-003",
    "Arnés de seguridad",
    "Seguridad",
    "MSA",
    "V-FORM",
    "MS7832",
    "2024-04-12",
    "Obra Norte",
    "En uso",
  ],
  [
    "AR-004",
    "Arnés de seguridad",
    "Seguridad",
    "MSA",
    "V-FORM",
    "MS7833",
    "2024-04-12",
    "Mediterrane Royal",
    "En uso",
  ],
  [
    "CO-001",
    "Cortadora de concreto",
    "Eléctrica",
    "Husqvarna",
    "K 770",
    "HQ0912",
    "2022-05-10",
    "Bodega principal",
    "Mantenimiento",
  ],
  [
    "GE-001",
    "Generador eléctrico",
    "Maquinaria",
    "Honda",
    "EU30is",
    "HN3012",
    "2021-12-01",
    "Obra Norte",
    "En uso",
  ],
].map((a) => ({
  id: a[0],
  name: a[1],
  category: a[2],
  brand: a[3],
  model: a[4],
  serial: a[5],
  acquired: a[6],
  location: a[7],
  status: a[8],
  photos:
    a[0] === "RT-001"
      ? drillPhotos
      : a[0] === "RT-004"
        ? [
            {
              id: "photo-rt004",
              url: "https://images.unsplash.com/photo-1598726935360-7a5e2464e22d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&w=900",
              description: "Fotografía general al ingresar a bodega.",
              kind: "General",
            },
          ]
        : [],
})) as Asset[];

const movementSeed: Movement[] = [
  {
    id: 1,
    date: "18 Jun 2025 · 09:42",
    type: "Despacho a obra",
    assetId: "PU-004",
    assetName: "Pulidora angular",
    origin: "Bodega principal",
    destination: "Arawak",
    deliveredBy: "Juan Pérez",
    receivedBy: "Andrés Gómez",
    observations: "Entrega verificada en obra.",
    accessoriesVerified: true,
  },
  {
    id: 2,
    date: "17 Jun 2025 · 16:18",
    type: "Traslado entre obras",
    assetId: "AR-004",
    assetName: "Arnés de seguridad",
    origin: "Arawak",
    destination: "Mediterrane Royal",
    deliveredBy: "Andrés Gómez",
    receivedBy: "Pedro Martínez",
    observations: "Traslado autorizado por dirección de obra.",
    accessoriesVerified: true,
  },
  {
    id: 3,
    date: "17 Jun 2025 · 11:05",
    type: "Devolución a bodega",
    assetId: "ET-002",
    assetName: "Escalera Transformer",
    origin: "Obra Norte",
    destination: "Bodega principal",
    deliveredBy: "Sofía Herrera",
    receivedBy: "Carlos Rodríguez",
    observations: "Unidad recibida sin novedades.",
    accessoriesVerified: true,
  },
  {
    id: 4,
    date: "16 Jun 2025 · 14:30",
    type: "Despacho a obra",
    assetId: "RT-003",
    assetName: "Taladro rotomartillo",
    origin: "Bodega principal",
    destination: "Mediterrane Royal",
    deliveredBy: "Carlos Rodríguez",
    receivedBy: "Pedro Martínez",
    observations: "",
    accessoriesVerified: true,
  },
  {
    id: 5,
    date: "13 Jun 2025 · 08:20",
    type: "Entrada a bodega",
    assetId: "AR-002",
    assetName: "Arnés de seguridad",
    origin: "Proveedor",
    destination: "Bodega principal",
    deliveredBy: "Proveedor externo",
    receivedBy: "Juan Pérez",
    observations: "Ingreso inicial al inventario.",
    accessoriesVerified: true,
  },
];

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "inventory" as Page, label: "Inventario", icon: Boxes },
  { id: "dispatch" as Page, label: "Despachos", icon: PackageCheck },
  { id: "projects" as Page, label: "Obras", icon: Building2 },
  { id: "responsibles" as Page, label: "Responsables", icon: Users },
  { id: "movements" as Page, label: "Historial", icon: Clock3 },
];

function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: "blue" | "green" | "amber" | "gray" | "violet";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Button({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`btn btn-${variant}`}>
      {children}
    </button>
  );
}

function Modal({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? "modal-wide" : ""}`}>
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function movementTone(type: Movement["type"]) {
  if (type === "Despacho a obra") return "blue";
  if (type === "Devolución a bodega") return "green";
  if (type === "Traslado entre obras") return "violet";
  return "gray";
}

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [assets, setAssets] = useState(assetSeed);
  const [projects, setProjects] = useState(projectsSeed);
  const [responsibles, setResponsibles] = useState(responsibleSeed);
  const [movements, setMovements] = useState(movementSeed);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [flow, setFlow] = useState<
    "dispatch" | "return" | "transfer" | "newAsset" | "newProject" | null
  >(null);
  const [flowProject, setFlowProject] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<
      string,
      { name: string; category: string; total: number; warehouse: number; sites: number }
    >();
    assets.forEach((a) => {
      const current = map.get(a.name) || {
        name: a.name,
        category: a.category,
        total: 0,
        warehouse: 0,
        sites: 0,
      };
      current.total++;
      if (a.location === "Bodega principal") current.warehouse++;
      else current.sites++;
      map.set(a.name, current);
    });
    return [...map.values()].filter(
      (g) =>
        g.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === "Todas" || g.category === category),
    );
  }, [assets, search, category]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const go = (next: Page) => {
    setPage(next);
    setSelectedType(null);
    setSelectedAsset(null);
    setSelectedProject(null);
    setSearch("");
    setMobileNav(false);
  };

  const openFlow = (type: typeof flow, project = "") => {
    setFlow(type);
    setFlowProject(project);
    setDestination("");
    setSelectedIds([]);
  };

  const sourceAssets = assets.filter((a) => {
    if (flow === "dispatch") return a.location === "Bodega principal" && a.status === "Disponible";
    if (flow === "return" || flow === "transfer") return a.location === flowProject;
    return false;
  });

  const toggleAsset = (id: string) =>
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const confirmMovement = (details: MovementDetails) => {
    if (!selectedIds.length) return;
    const target = flow === "return" ? "Bodega principal" : destination;
    const origin = flow === "dispatch" ? "Bodega principal" : flowProject;
    const type: Movement["type"] =
      flow === "dispatch"
        ? "Despacho a obra"
        : flow === "return"
          ? "Devolución a bodega"
          : "Traslado entre obras";
    setAssets((current) =>
      current.map((a) =>
        selectedIds.includes(a.id)
          ? {
              ...a,
              location: target,
              status: target === "Bodega principal" ? "Disponible" : "En uso",
            }
          : a,
      ),
    );
    const moved = assets.filter((a) => selectedIds.includes(a.id));
    setMovements((current) => [
      ...moved.map((a, i) => ({
        id: Date.now() + i,
        date: details.movementDate,
        type,
        assetId: a.id,
        assetName: a.name,
        origin,
        destination: target,
        deliveredBy: details.deliveredBy,
        receivedBy: details.receivedBy,
        observations: details.observations,
        accessoriesVerified: details.accessoriesVerified,
      })),
      ...current,
    ]);
    setFlow(null);
    notify(
      `${selectedIds.length} ${selectedIds.length === 1 ? "herramienta actualizada" : "herramientas actualizadas"} correctamente`,
    );
  };

  const currentTitle = navItems.find((n) => n.id === page)?.label;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <ToolCase size={23} strokeWidth={2.2} />
          </div>
          <div>
            <strong>RH Tools</strong>
            <span>Control de inventario</span>
          </div>
        </div>
        <nav>
          <span className="nav-label">OPERACIÓN</span>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={page === item.id ? "active" : ""}
              onClick={() => go(item.id)}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
              {page === item.id && <ChevronRight size={16} className="nav-arrow" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button>
            <Settings size={18} />
            <span>Configuración</span>
          </button>
          <div className="user-card">
            <div className="avatar">JM</div>
            <div>
              <strong>Javier Martínez</strong>
              <span>Jefe de bodega</span>
            </div>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>

      <main className="main">
        <header>
          <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}>
            <Menu size={22} />
          </button>
          <div>
            <p className="eyebrow">RH TOOLS / {currentTitle?.toUpperCase()}</p>
            <h1>{currentTitle}</h1>
          </div>
          <div className="header-actions">
            <div className="system-status">
              <span /> Sistema actualizado
            </div>
            <div className="header-avatar">
              <UserRound size={18} />
            </div>
          </div>
        </header>

        <div className="content">
          {page === "dashboard" && (
            <Dashboard
              assets={assets}
              projects={projects}
              movements={movements}
              onNavigate={go}
              onDispatch={() => openFlow("dispatch")}
            />
          )}
          {page === "inventory" && !selectedType && (
            <Inventory
              grouped={grouped}
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              onSelect={setSelectedType}
              onNew={() => openFlow("newAsset")}
            />
          )}
          {page === "inventory" && selectedType && !selectedAsset && (
            <TypeDetail
              name={selectedType}
              assets={assets.filter((a) => a.name === selectedType)}
              onBack={() => setSelectedType(null)}
              onSelect={setSelectedAsset}
            />
          )}
          {page === "inventory" && selectedAsset && (
            <AssetDetail
              asset={assets.find((a) => a.id === selectedAsset.id) || selectedAsset}
              movements={movements.filter((m) => m.assetId === selectedAsset.id)}
              onBack={() => setSelectedAsset(null)}
              onUpdate={(updated) => {
                setAssets((list) => list.map((a) => (a.id === updated.id ? updated : a)));
                setSelectedAsset(updated);
              }}
              notify={notify}
            />
          )}
          {page === "dispatch" && (
            <DispatchPage movements={movements} onNew={() => openFlow("dispatch")} />
          )}
          {page === "projects" && !selectedProject && (
            <ProjectsPage
              projects={projects}
              assets={assets}
              onSelect={setSelectedProject}
              onNew={() => openFlow("newProject")}
              onToggle={(name) =>
                setProjects((list) =>
                  list.map((p) =>
                    p.name === name
                      ? { ...p, status: p.status === "Activa" ? "Finalizada" : "Activa" }
                      : p,
                  ),
                )
              }
            />
          )}
          {page === "projects" && selectedProject && (
            <ProjectDetail
              project={projects.find((p) => p.name === selectedProject.name) || selectedProject}
              assets={assets.filter((a) => a.location === selectedProject.name)}
              movements={movements.filter(
                (m) => m.origin === selectedProject.name || m.destination === selectedProject.name,
              )}
              onBack={() => setSelectedProject(null)}
              onReturn={() => openFlow("return", selectedProject.name)}
              onTransfer={() => openFlow("transfer", selectedProject.name)}
            />
          )}
          {page === "movements" && (
            <MovementsPage movements={movements} search={search} setSearch={setSearch} />
          )}
          {page === "responsibles" && (
            <ResponsiblesPage
              responsibles={responsibles}
              projects={projects}
              onChange={setResponsibles}
              notify={notify}
            />
          )}
        </div>
      </main>

      {(flow === "dispatch" || flow === "return" || flow === "transfer") && (
        <MovementModal
          flow={flow}
          source={flowProject}
          destination={destination}
          setDestination={setDestination}
          projects={projects.filter((p) => p.status === "Activa" && p.name !== flowProject)}
          assets={sourceAssets}
          responsibles={responsibles.filter((person) => person.status === "Activo")}
          selectedIds={selectedIds}
          toggle={toggleAsset}
          onClose={() => setFlow(null)}
          onConfirm={confirmMovement}
        />
      )}
      {flow === "newAsset" && (
        <NewAssetModal
          onClose={() => setFlow(null)}
          onSave={(asset) => {
            setAssets((list) => [...list, asset]);
            setMovements((list) => [
              {
                id: Date.now(),
                date: "Ahora",
                type: "Entrada a bodega",
                assetId: asset.id,
                assetName: asset.name,
                origin: "Proveedor",
                destination: "Bodega principal",
                deliveredBy: "Proveedor externo",
                receivedBy: "Juan Pérez",
                observations: "Ingreso inicial al inventario.",
                accessoriesVerified: true,
              },
              ...list,
            ]);
            setFlow(null);
            notify("Herramienta registrada correctamente");
          }}
        />
      )}
      {flow === "newProject" && (
        <NewProjectModal
          onClose={() => setFlow(null)}
          onSave={(project) => {
            setProjects((list) => [...list, project]);
            setFlow(null);
            notify("Obra creada correctamente");
          }}
        />
      )}
      {toast && (
        <div className="toast">
          <div>
            <Check size={17} />
          </div>
          {toast}
        </div>
      )}
    </div>
  );
}

function Dashboard({
  assets,
  projects,
  movements,
  onNavigate,
  onDispatch,
}: {
  assets: Asset[];
  projects: Project[];
  movements: Movement[];
  onNavigate: (p: Page) => void;
  onDispatch: () => void;
}) {
  const warehouse = assets.filter((a) => a.location === "Bodega principal").length;
  const kpis = [
    {
      label: "Herramientas registradas",
      value: assets.length,
      note: "Unidades físicas",
      icon: ToolCase,
      color: "navy",
    },
    {
      label: "Disponibles en bodega",
      value: warehouse,
      note: `${Math.round((warehouse / assets.length) * 100)}% del inventario`,
      icon: Warehouse,
      color: "green",
    },
    {
      label: "Distribuidas en obras",
      value: assets.length - warehouse,
      note: `${projects.filter((p) => p.status === "Activa").length} ubicaciones activas`,
      icon: HardHat,
      color: "blue",
    },
    {
      label: "Obras activas",
      value: projects.filter((p) => p.status === "Activa").length,
      note: "Operación vigente",
      icon: Building2,
      color: "amber",
    },
  ];
  return (
    <>
      <div className="welcome-row">
        <div>
          <h2>Buenos días, Javier</h2>
          <p>Este es el estado general del inventario al día de hoy.</p>
        </div>
        <Button onClick={onDispatch}>
          <Plus size={17} /> Nuevo despacho
        </Button>
      </div>
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className={`kpi-icon ${k.color}`}>
              <k.icon size={21} />
            </div>
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-note">
              <span className={k.color === "green" ? "dot-green" : ""} />
              {k.note}
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard-grid">
        <section className="panel recent-panel">
          <div className="panel-head">
            <div>
              <h3>Movimientos recientes</h3>
              <p>Últimas actualizaciones del inventario</p>
            </div>
            <button className="text-link" onClick={() => onNavigate("movements")}>
              Ver historial <ArrowRight size={15} />
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Movimiento</th>
                  <th>Herramienta</th>
                  <th>Ruta</th>
                </tr>
              </thead>
              <tbody>
                {movements.slice(0, 5).map((m) => (
                  <tr key={m.id}>
                    <td>
                      <span className="date-cell">{m.date.split(" · ")[0]}</span>
                      <small>{m.date.split(" · ")[1]}</small>
                    </td>
                    <td>
                      <Badge tone={movementTone(m.type)}>{m.type}</Badge>
                    </td>
                    <td>
                      <strong>{m.assetName}</strong>
                      <small>{m.assetId}</small>
                    </td>
                    <td>
                      <div className="route">
                        <span>{m.origin}</span>
                        <ArrowRight size={14} />
                        <strong>{m.destination}</strong>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <aside className="panel quick-panel">
          <div className="panel-head">
            <div>
              <h3>Acciones rápidas</h3>
              <p>Operaciones frecuentes</p>
            </div>
          </div>
          <button onClick={onDispatch}>
            <span className="quick-icon blue">
              <PackageCheck size={19} />
            </span>
            <span>
              <strong>Registrar despacho</strong>
              <small>De bodega hacia una obra</small>
            </span>
            <ChevronRight size={17} />
          </button>
          <button onClick={() => onNavigate("projects")}>
            <span className="quick-icon green">
              <ArrowLeft size={19} />
            </span>
            <span>
              <strong>Registrar devolución</strong>
              <small>Regresar unidades a bodega</small>
            </span>
            <ChevronRight size={17} />
          </button>
          <button onClick={() => onNavigate("projects")}>
            <span className="quick-icon violet">
              <ArrowRightLeft size={19} />
            </span>
            <span>
              <strong>Trasladar herramientas</strong>
              <small>Movimiento entre obras</small>
            </span>
            <ChevronRight size={17} />
          </button>
          <button onClick={() => onNavigate("inventory")}>
            <span className="quick-icon gray">
              <Search size={19} />
            </span>
            <span>
              <strong>Consultar inventario</strong>
              <small>Buscar una herramienta</small>
            </span>
            <ChevronRight size={17} />
          </button>
        </aside>
      </div>
    </>
  );
}

function Inventory({
  grouped,
  search,
  setSearch,
  category,
  setCategory,
  onSelect,
  onNew,
}: {
  grouped: { name: string; category: string; total: number; warehouse: number; sites: number }[];
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  onSelect: (v: string) => void;
  onNew: () => void;
}) {
  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Inventario general</h2>
          <p>Consulta las existencias agrupadas por tipo de herramienta.</p>
        </div>
        <Button onClick={onNew}>
          <Plus size={17} /> Nueva herramienta
        </Button>
      </div>
      <section className="panel">
        <div className="toolbar">
          <label className="search">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre..."
            />
          </label>
          <label className="select-control">
            <SlidersHorizontal size={16} />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Todas</option>
              <option>Eléctrica</option>
              <option>Escaleras</option>
              <option>Seguridad</option>
              <option>Maquinaria</option>
            </select>
          </label>
          <div className="result-count">{grouped.length} tipos de herramienta</div>
        </div>
        <div className="table-wrap">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Herramienta</th>
                <th>Categoría</th>
                <th>Total empresa</th>
                <th>En bodega</th>
                <th>En obras</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((g) => (
                <tr key={g.name} onClick={() => onSelect(g.name)} className="clickable">
                  <td>
                    <div className="tool-name">
                      <span>
                        <ToolCase size={19} />
                      </span>
                      <strong>{g.name}</strong>
                    </div>
                  </td>
                  <td>
                    <Badge tone="gray">{g.category}</Badge>
                  </td>
                  <td>
                    <strong className="number">{g.total}</strong>
                  </td>
                  <td>
                    <span className="stock stock-green">{g.warehouse}</span>
                  </td>
                  <td>
                    <span className="stock stock-blue">{g.sites}</span>
                  </td>
                  <td>
                    <button className="row-action">
                      Ver unidades <ChevronRight size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!grouped.length && (
          <div className="empty">
            <Search size={26} />
            <h3>Sin resultados</h3>
            <p>Prueba con otro término o categoría.</p>
          </div>
        )}
      </section>
    </>
  );
}

function TypeDetail({
  name,
  assets,
  onBack,
  onSelect,
}: {
  name: string;
  assets: Asset[];
  onBack: () => void;
  onSelect: (a: Asset) => void;
}) {
  return (
    <>
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={17} /> Volver al inventario
      </button>
      <div className="page-intro">
        <div>
          <div className="title-line">
            <div className="large-tool-icon">
              <ToolCase size={24} />
            </div>
            <div>
              <h2>{name}</h2>
              <p>{assets.length} unidades físicas registradas</p>
            </div>
          </div>
        </div>
        <Button variant="secondary">
          <Plus size={17} /> Agregar unidad
        </Button>
      </div>
      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Marca / Modelo</th>
                <th>Serial</th>
                <th>Ubicación actual</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a) => (
                <tr className="clickable" key={a.id} onClick={() => onSelect(a)}>
                  <td>
                    <strong>{a.id}</strong>
                  </td>
                  <td>
                    <strong>{a.brand}</strong>
                    <small>{a.model}</small>
                  </td>
                  <td>{a.serial}</td>
                  <td>
                    <div className="location-cell">
                      {a.location === "Bodega principal" ? (
                        <Warehouse size={16} />
                      ) : (
                        <Building2 size={16} />
                      )}
                      {a.location}
                    </div>
                  </td>
                  <td>
                    <Badge
                      tone={
                        a.status === "Disponible"
                          ? "green"
                          : a.status === "En uso"
                            ? "blue"
                            : "amber"
                      }
                    >
                      {a.status}
                    </Badge>
                  </td>
                  <td>
                    <button className="row-action">
                      Hoja de vida <ChevronRight size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function AssetDetail({
  asset,
  movements,
  onBack,
  onUpdate,
  notify,
}: {
  asset: Asset;
  movements: Movement[];
  onBack: () => void;
  onUpdate: (asset: Asset) => void;
  notify: (message: string) => void;
}) {
  const [photoModal, setPhotoModal] = useState<"general" | "novelty" | null>(null);
  const [lightbox, setLightbox] = useState<AssetPhoto | null>(null);

  const addPhotos = (photos: AssetPhoto[]) => {
    onUpdate({ ...asset, photos: [...asset.photos, ...photos] });
    setPhotoModal(null);
    notify(
      photos[0]?.kind === "Novedad"
        ? "Novedad fotográfica registrada"
        : `${photos.length} ${photos.length === 1 ? "fotografía agregada" : "fotografías agregadas"}`,
    );
  };

  const removePhoto = (id: string) => {
    onUpdate({ ...asset, photos: asset.photos.filter((photo) => photo.id !== id) });
    notify("Fotografía eliminada");
  };

  const replacePhoto = (id: string, file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpdate({
      ...asset,
      photos: asset.photos.map((photo) => (photo.id === id ? { ...photo, url } : photo)),
    });
    notify("Fotografía reemplazada");
  };

  return (
    <>
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={17} /> Volver a unidades
      </button>
      <div className="asset-hero panel">
        <div className="asset-photo">
          {asset.photos[0] ? (
            <img src={asset.photos[0].url} alt={asset.photos[0].description} />
          ) : (
            <ToolCase size={48} />
          )}
        </div>
        <div className="asset-main">
          <span className="asset-code">{asset.id}</span>
          <h2>{asset.name}</h2>
          <p>
            {asset.brand} · {asset.model}
          </p>
        </div>
        <div className="asset-location">
          <small>UBICACIÓN ACTUAL</small>
          <strong>{asset.location}</strong>
          <Badge tone={asset.status === "Disponible" ? "green" : "blue"}>{asset.status}</Badge>
        </div>
        <Button variant="secondary">Editar información</Button>
      </div>
      <div className="detail-grid">
        <section className="panel detail-card">
          <div className="panel-head">
            <div>
              <h3>Información de la unidad</h3>
              <p>Datos de identificación y compra</p>
            </div>
          </div>
          <div className="info-grid">
            {[
              ["Código interno", asset.id],
              ["Marca", asset.brand],
              ["Modelo", asset.model],
              ["Número de serie", asset.serial],
              ["Fecha de adquisición", asset.acquired],
              ["Categoría", asset.category],
            ].map(([k, v]) => (
              <div key={k}>
                <small>{k}</small>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="panel timeline-card">
          <div className="panel-head">
            <div>
              <h3>Historial de movimientos</h3>
              <p>Trazabilidad de esta unidad</p>
            </div>
          </div>
          <div className="timeline">
            {movements.length ? (
              movements.map((m) => (
                <div className="timeline-item" key={m.id}>
                  <span className={`timeline-dot ${movementTone(m.type)}`} />
                  <div>
                    <div className="timeline-title">
                      <strong>{m.type}</strong>
                      <small>{m.date}</small>
                    </div>
                    <p>
                      {m.origin} <ArrowRight size={13} /> {m.destination}
                    </p>
                    <div className="movement-people-line">
                      <UserRound size={12} />
                      <span>{m.deliveredBy}</span>
                      <ArrowRight size={11} />
                      <span>{m.receivedBy}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty compact">
                <Clock3 size={23} />
                <p>Sin movimientos recientes registrados.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      <section className="panel photo-section">
        <div className="panel-head">
          <div>
            <h3>Galería de fotografías</h3>
            <p>{asset.photos.length} imágenes vinculadas a esta unidad</p>
          </div>
          <div className="button-group">
            <Button variant="secondary" onClick={() => setPhotoModal("novelty")}>
              <Wrench size={16} /> Registrar novedad
            </Button>
            <Button onClick={() => setPhotoModal("general")}>
              <ImagePlus size={16} /> Agregar fotografías
            </Button>
          </div>
        </div>
        {asset.photos.length ? (
          <div className="photo-grid">
            {asset.photos.map((photo) => (
              <article className="photo-card" key={photo.id}>
                <button className="photo-preview" onClick={() => setLightbox(photo)}>
                  <img src={photo.url} alt={photo.description} />
                  <span>
                    <Maximize2 size={17} /> Ampliar
                  </span>
                </button>
                <div className="photo-meta">
                  <Badge tone={photo.kind === "Novedad" ? "amber" : "gray"}>{photo.kind}</Badge>
                  <p>{photo.description}</p>
                  <div>
                    <label className="photo-action">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => replacePhoto(photo.id, e.target.files?.[0])}
                      />
                      <Upload size={14} /> Reemplazar
                    </label>
                    <button className="photo-action danger" onClick={() => removePhoto(photo.id)}>
                      <Trash2 size={14} /> Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <label className="photo-empty" onClick={() => setPhotoModal("general")}>
            <span>
              <Camera size={25} />
            </span>
            <strong>Agrega la primera fotografía</strong>
            <p>Documenta el estado, identificación y accesorios de esta herramienta.</p>
          </label>
        )}
      </section>
      {photoModal && (
        <PhotoUploadModal
          novelty={photoModal === "novelty"}
          onClose={() => setPhotoModal(null)}
          onSave={addPhotos}
        />
      )}
      {lightbox && (
        <div
          className="lightbox"
          onMouseDown={(e) => e.target === e.currentTarget && setLightbox(null)}
        >
          <button className="lightbox-close" onClick={() => setLightbox(null)}>
            <X size={22} />
          </button>
          <div>
            <img src={lightbox.url} alt={lightbox.description} />
            <section>
              <Badge tone={lightbox.kind === "Novedad" ? "amber" : "gray"}>{lightbox.kind}</Badge>
              <p>{lightbox.description}</p>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

function DispatchPage({ movements, onNew }: { movements: Movement[]; onNew: () => void }) {
  const dispatches = movements.filter((m) => m.type === "Despacho a obra");
  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Despachos a obras</h2>
          <p>Gestiona las salidas desde la bodega principal.</p>
        </div>
        <Button onClick={onNew}>
          <Plus size={17} /> Nuevo despacho
        </Button>
      </div>
      <div className="mini-kpis">
        <div>
          <PackageCheck size={20} />
          <span>
            <small>Despachos este mes</small>
            <strong>{dispatches.length}</strong>
          </span>
        </div>
        <div>
          <ToolCase size={20} />
          <span>
            <small>Unidades despachadas</small>
            <strong>{dispatches.length}</strong>
          </span>
        </div>
        <div>
          <CircleGauge size={20} />
          <span>
            <small>Último movimiento</small>
            <strong>Hoy, 09:42</strong>
          </span>
        </div>
      </div>
      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Despachos recientes</h3>
            <p>Registro de salidas confirmadas</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Herramienta</th>
                <th>Código</th>
                <th>Destino</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((m) => (
                <tr key={m.id}>
                  <td>{m.date}</td>
                  <td>
                    <strong>{m.assetName}</strong>
                  </td>
                  <td>{m.assetId}</td>
                  <td>
                    <div className="location-cell">
                      <Building2 size={16} />
                      {m.destination}
                    </div>
                  </td>
                  <td>
                    <Badge tone="green">Confirmado</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function ProjectsPage({
  projects,
  assets,
  onSelect,
  onNew,
  onToggle,
}: {
  projects: Project[];
  assets: Asset[];
  onSelect: (p: Project) => void;
  onNew: () => void;
  onToggle: (name: string) => void;
}) {
  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Obras y unidades</h2>
          <p>Administra ubicaciones y consulta su inventario actual.</p>
        </div>
        <Button onClick={onNew}>
          <Plus size={17} /> Nueva obra
        </Button>
      </div>
      <div className="project-grid">
        {projects.map((p) => {
          const count = assets.filter((a) => a.location === p.name).length;
          return (
            <article className="project-card panel" key={p.name}>
              <div className="project-top">
                <div className="project-icon">
                  <Building2 size={22} />
                </div>
                <Badge tone={p.status === "Activa" ? "green" : "gray"}>{p.status}</Badge>
              </div>
              <span className="project-code">{p.code}</span>
              <h3>{p.name}</h3>
              <p>
                <UserRound size={14} /> {p.manager}
              </p>
              <div className="project-stock">
                <span>
                  <ToolCase size={18} />
                  <strong>{count}</strong> unidades asignadas
                </span>
              </div>
              <div className="project-actions">
                <button onClick={() => onSelect(p)}>
                  Ver inventario <ChevronRight size={15} />
                </button>
                <button onClick={() => onToggle(p.name)}>
                  {p.status === "Activa" ? "Finalizar" : "Activar"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function ProjectDetail({
  project,
  assets,
  movements,
  onBack,
  onReturn,
  onTransfer,
}: {
  project: Project;
  assets: Asset[];
  movements: Movement[];
  onBack: () => void;
  onReturn: () => void;
  onTransfer: () => void;
}) {
  const groups = [...new Set(assets.map((a) => a.name))].map((name) => ({
    name,
    count: assets.filter((a) => a.name === name).length,
  }));
  return (
    <>
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={17} /> Volver a obras
      </button>
      <div className="project-detail-head">
        <div>
          <span className="project-code">{project.code}</span>
          <h2>{project.name}</h2>
          <p>
            {project.manager} ·{" "}
            <Badge tone={project.status === "Activa" ? "green" : "gray"}>{project.status}</Badge>
          </p>
        </div>
        <div className="button-group">
          <Button variant="secondary" onClick={onTransfer}>
            <ArrowRightLeft size={17} /> Trasladar
          </Button>
          <Button onClick={onReturn}>
            <ArrowLeft size={17} /> Registrar devolución
          </Button>
        </div>
      </div>
      <div className="detail-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Inventario actual</h3>
              <p>{assets.length} unidades físicas en esta obra</p>
            </div>
          </div>
          {groups.length ? (
            <div className="site-groups">
              {groups.map((g) => (
                <div key={g.name}>
                  <span className="quick-icon gray">
                    <ToolCase size={18} />
                  </span>
                  <strong>{g.name}</strong>
                  <span>
                    {g.count} {g.count === 1 ? "unidad" : "unidades"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty compact">
              <Boxes size={25} />
              <p>Esta obra no tiene herramientas asignadas.</p>
            </div>
          )}
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Entradas y salidas</h3>
              <p>Movimientos recientes de la obra</p>
            </div>
          </div>
          <div className="timeline small">
            {movements.slice(0, 5).map((m) => (
              <div className="timeline-item" key={m.id}>
                <span className={`timeline-dot ${movementTone(m.type)}`} />
                <div>
                  <strong>{m.type}</strong>
                  <p>
                    {m.assetId} · {m.assetName}
                  </p>
                  <div className="movement-people-line">
                    <UserRound size={11} /> {m.deliveredBy} → {m.receivedBy}
                  </div>
                  <small>{m.date}</small>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function ResponsiblesPage({
  responsibles,
  projects,
  onChange,
  notify,
}: {
  responsibles: Responsible[];
  projects: Project[];
  onChange: React.Dispatch<React.SetStateAction<Responsible[]>>;
  notify: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Responsible | "new" | null>(null);
  const [viewing, setViewing] = useState<Responsible | null>(null);
  const filtered = responsibles.filter((person) =>
    `${person.name} ${person.role} ${person.identification}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const save = (person: Responsible) => {
    onChange((current) => {
      const exists = current.some((item) => item.id === person.id);
      return exists
        ? current.map((item) => (item.id === person.id ? person : item))
        : [...current, person];
    });
    setEditing(null);
    notify(editing === "new" ? "Responsable registrado correctamente" : "Información actualizada");
  };

  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Responsables</h2>
          <p>Personas autorizadas para entregar, recibir y custodiar herramientas.</p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus size={17} /> Registrar responsable
        </Button>
      </div>
      <div className="responsible-stats">
        <div>
          <span className="quick-icon blue">
            <Users size={19} />
          </span>
          <p>
            <small>Total registrados</small>
            <strong>{responsibles.length}</strong>
          </p>
        </div>
        <div>
          <span className="quick-icon green">
            <Check size={19} />
          </span>
          <p>
            <small>Responsables activos</small>
            <strong>{responsibles.filter((person) => person.status === "Activo").length}</strong>
          </p>
        </div>
      </div>
      <section className="panel">
        <div className="toolbar">
          <label className="search">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, cargo o identificación..."
            />
          </label>
          <div className="result-count">{filtered.length} responsables</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre completo</th>
                <th>Identificación</th>
                <th>Cargo</th>
                <th>Teléfono</th>
                <th>Obra asignada</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="responsible-name">
                      <span>{initials(person.name)}</span>
                      <strong>{person.name}</strong>
                    </div>
                  </td>
                  <td>{person.identification || "—"}</td>
                  <td>
                    <strong>{person.role}</strong>
                  </td>
                  <td>{person.phone || "—"}</td>
                  <td>{person.project || "Sin asignar"}</td>
                  <td>
                    <button
                      onClick={() => {
                        onChange((current) =>
                          current.map((item) =>
                            item.id === person.id
                              ? {
                                  ...item,
                                  status: item.status === "Activo" ? "Inactivo" : "Activo",
                                }
                              : item,
                          ),
                        );
                        notify(
                          person.status === "Activo"
                            ? "Responsable desactivado"
                            : "Responsable activado",
                        );
                      }}
                    >
                      <Badge tone={person.status === "Activo" ? "green" : "gray"}>
                        {person.status}
                      </Badge>
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button onClick={() => setViewing(person)}>
                        <Search size={14} /> Consultar
                      </button>
                      <button onClick={() => setEditing(person)}>
                        <Settings size={14} /> Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {editing && (
        <ResponsibleFormModal
          responsible={editing === "new" ? null : editing}
          projects={projects}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
      {viewing && (
        <ResponsibleDetailModal
          responsible={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => {
            setEditing(viewing);
            setViewing(null);
          }}
        />
      )}
    </>
  );
}

function ResponsibleFormModal({
  responsible,
  projects,
  onClose,
  onSave,
}: {
  responsible: Responsible | null;
  projects: Project[];
  onClose: () => void;
  onSave: (person: Responsible) => void;
}) {
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: responsible?.id || Date.now(),
      name: String(form.get("name")),
      identification: String(form.get("identification")),
      role: String(form.get("role")),
      phone: String(form.get("phone")),
      project: String(form.get("project")),
      status: (String(form.get("status")) || "Activo") as Responsible["status"],
    });
  };
  return (
    <Modal
      title={responsible ? "Editar responsable" : "Registrar responsable"}
      subtitle="Esta persona podrá seleccionarse en los movimientos de herramientas."
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="modal-body form-grid">
          <div className="form-group full">
            <label>Nombre completo *</label>
            <input
              name="name"
              defaultValue={responsible?.name}
              required
              placeholder="Nombre y apellido"
            />
          </div>
          <div className="form-group">
            <label>Número de identificación</label>
            <input
              name="identification"
              defaultValue={responsible?.identification}
              placeholder="Opcional"
            />
          </div>
          <div className="form-group">
            <label>Cargo *</label>
            <input
              name="role"
              defaultValue={responsible?.role}
              required
              placeholder="Ej. Almacenista"
            />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input name="phone" defaultValue={responsible?.phone} placeholder="Opcional" />
          </div>
          <div className="form-group">
            <label>Obra asignada</label>
            <select name="project" defaultValue={responsible?.project}>
              <option value="">Sin asignar</option>
              <option>Bodega principal</option>
              {projects.map((project) => (
                <option key={project.code}>{project.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group full">
            <label>Estado</label>
            <select name="status" defaultValue={responsible?.status || "Activo"}>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>
        <div className="modal-foot">
          <div>
            <ShieldCheck size={17} /> Solo las personas activas aparecen en los movimientos.
          </div>
          <span>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar responsable</Button>
          </span>
        </div>
      </form>
    </Modal>
  );
}

function ResponsibleDetailModal({
  responsible,
  onClose,
  onEdit,
}: {
  responsible: Responsible;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <Modal
      title="Ficha del responsable"
      subtitle="Información de contacto y asignación."
      onClose={onClose}
    >
      <div className="responsible-profile">
        <div className="responsible-profile-head">
          <span>{initials(responsible.name)}</span>
          <div>
            <h3>{responsible.name}</h3>
            <p>{responsible.role}</p>
          </div>
          <Badge tone={responsible.status === "Activo" ? "green" : "gray"}>
            {responsible.status}
          </Badge>
        </div>
        <div className="responsible-profile-grid">
          <div>
            <IdCard size={17} />
            <span>
              <small>Identificación</small>
              <strong>{responsible.identification || "No registrada"}</strong>
            </span>
          </div>
          <div>
            <Phone size={17} />
            <span>
              <small>Teléfono</small>
              <strong>{responsible.phone || "No registrado"}</strong>
            </span>
          </div>
          <div>
            <Building2 size={17} />
            <span>
              <small>Obra asignada</small>
              <strong>{responsible.project || "Sin asignar"}</strong>
            </span>
          </div>
        </div>
      </div>
      <div className="modal-foot">
        <div>Los movimientos históricos conservarán este nombre.</div>
        <span>
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={onEdit}>Editar información</Button>
        </span>
      </div>
    </Modal>
  );
}

function MovementsPage({
  movements,
  search,
  setSearch,
}: {
  movements: Movement[];
  search: string;
  setSearch: (v: string) => void;
}) {
  const [type, setType] = useState("Todos");
  const filtered = movements.filter(
    (m) =>
      (type === "Todos" || m.type === type) &&
      `${m.assetName} ${m.assetId} ${m.origin} ${m.destination} ${m.deliveredBy} ${m.receivedBy}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Historial de movimientos</h2>
          <p>Trazabilidad completa de todas las herramientas.</p>
        </div>
        <Button variant="secondary">
          <ClipboardList size={17} /> Exportar registro
        </Button>
      </div>
      <section className="panel">
        <div className="toolbar">
          <label className="search">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar herramienta, código, obra o responsable..."
            />
          </label>
          <label className="select-control">
            <SlidersHorizontal size={16} />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>Todos</option>
              <option>Entrada a bodega</option>
              <option>Despacho a obra</option>
              <option>Devolución a bodega</option>
              <option>Traslado entre obras</option>
            </select>
          </label>
          <label className="select-control">
            <Clock3 size={16} />
            <select>
              <option>Últimos 30 días</option>
              <option>Este mes</option>
              <option>Este año</option>
            </select>
          </label>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Tipo de movimiento</th>
                <th>Herramienta</th>
                <th>Origen</th>
                <th>Destino</th>
                <th>Entrega</th>
                <th>Recibe</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td>{m.date}</td>
                  <td>
                    <Badge tone={movementTone(m.type)}>{m.type}</Badge>
                  </td>
                  <td>
                    <strong>{m.assetName}</strong>
                  </td>
                  <td>{m.origin}</td>
                  <td>
                    <strong>{m.destination}</strong>
                  </td>
                  <td>
                    <div className="person-cell">
                      <span>{initials(m.deliveredBy)}</span>
                      {m.deliveredBy}
                    </div>
                  </td>
                  <td>
                    <div className="person-cell">
                      <span>{initials(m.receivedBy)}</span>
                      {m.receivedBy}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function MovementModal({
  flow,
  source,
  destination,
  setDestination,
  projects,
  assets,
  responsibles,
  selectedIds,
  toggle,
  onClose,
  onConfirm,
}: {
  flow: "dispatch" | "return" | "transfer";
  source: string;
  destination: string;
  setDestination: (v: string) => void;
  projects: Project[];
  assets: Asset[];
  responsibles: Responsible[];
  selectedIds: string[];
  toggle: (id: string) => void;
  onClose: () => void;
  onConfirm: (details: MovementDetails) => void;
}) {
  const [dispatchSearch, setDispatchSearch] = useState("");
  const [dispatchCategory, setDispatchCategory] = useState("Todas");
  const [deliveredBy, setDeliveredBy] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [movementDate, setMovementDate] = useState(new Date().toISOString().slice(0, 10));
  const [observations, setObservations] = useState("");
  const [accessoriesVerified, setAccessoriesVerified] = useState(false);
  const title =
    flow === "dispatch"
      ? "Nuevo despacho"
      : flow === "return"
        ? `Devolución · ${source}`
        : `Traslado desde ${source}`;
  const ready =
    selectedIds.length > 0 &&
    (flow === "return" || destination) &&
    deliveredBy &&
    receivedBy &&
    movementDate &&
    accessoriesVerified;
  const details = {
    deliveredBy,
    receivedBy,
    movementDate,
    observations,
    accessoriesVerified,
  };
  const normalizedSearch = dispatchSearch.trim().toLowerCase();
  const filteredAssets = assets.filter(
    (asset) =>
      (dispatchCategory === "Todas" || asset.category === dispatchCategory) &&
      (!normalizedSearch ||
        `${asset.id} ${asset.name} ${asset.brand} ${asset.model} ${asset.serial}`
          .toLowerCase()
          .includes(normalizedSearch)),
  );
  const selectedAssets = assets.filter((asset) => selectedIds.includes(asset.id));

  if (flow === "dispatch") {
    return (
      <Modal
        title={title}
        subtitle="Busca y selecciona las unidades exactas que saldrán de bodega."
        onClose={onClose}
        wide
      >
        <div className="dispatch-route">
          <div>
            <span>ORIGEN</span>
            <strong>
              <Warehouse size={16} /> Bodega principal
            </strong>
          </div>
          <ArrowRight size={18} />
          <div className="form-group">
            <label>OBRA DE DESTINO</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option value="">Seleccionar una obra...</option>
              {projects.map((p) => (
                <option key={p.code}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        <MovementPeopleFields
          responsibles={responsibles}
          deliveredBy={deliveredBy}
          receivedBy={receivedBy}
          movementDate={movementDate}
          observations={observations}
          accessoriesVerified={accessoriesVerified}
          setDeliveredBy={setDeliveredBy}
          setReceivedBy={setReceivedBy}
          setMovementDate={setMovementDate}
          setObservations={setObservations}
          setAccessoriesVerified={setAccessoriesVerified}
        />
        <div className="dispatch-builder">
          <section className="dispatch-search-panel">
            <div className="dispatch-column-head">
              <div>
                <span className="step-number">1</span>
                <strong>Buscar herramientas</strong>
              </div>
              <small>{assets.length} disponibles</small>
            </div>
            <label className="dispatch-search">
              <Search size={19} />
              <input
                autoFocus
                value={dispatchSearch}
                onChange={(e) => setDispatchSearch(e.target.value)}
                placeholder="Nombre, código, marca, modelo o serial..."
              />
              {dispatchSearch && (
                <button onClick={() => setDispatchSearch("")}>
                  <X size={16} />
                </button>
              )}
            </label>
            <div className="category-chips">
              {["Todas", ...new Set(assets.map((asset) => asset.category))].map((item) => (
                <button
                  key={item}
                  className={dispatchCategory === item ? "active" : ""}
                  onClick={() => setDispatchCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="dispatch-results">
              {filteredAssets.map((asset) => {
                const selected = selectedIds.includes(asset.id);
                return (
                  <article key={asset.id} className={selected ? "is-selected" : ""}>
                    <AssetThumbnail asset={asset} />
                    <div>
                      <span>{asset.id}</span>
                      <strong>{asset.name}</strong>
                      <small>
                        {asset.brand} · {asset.model} · S/N {asset.serial}
                      </small>
                    </div>
                    <Badge tone="green">Disponible</Badge>
                    <button
                      className={selected ? "added-button" : "add-button"}
                      onClick={() => toggle(asset.id)}
                    >
                      {selected ? <Check size={15} /> : <Plus size={15} />}
                      {selected ? "Agregada" : "Agregar"}
                    </button>
                  </article>
                );
              })}
              {!filteredAssets.length && (
                <div className="dispatch-empty">
                  <Search size={25} />
                  <strong>No encontramos herramientas disponibles</strong>
                  <p>Prueba con otro nombre, código, marca o serial.</p>
                </div>
              )}
            </div>
          </section>
          <aside className="dispatch-cart">
            <div className="dispatch-column-head">
              <div>
                <span className="step-number">2</span>
                <strong>Lista de despacho</strong>
              </div>
              <Badge tone="blue">{selectedIds.length}</Badge>
            </div>
            <div className="dispatch-cart-list">
              {selectedAssets.length ? (
                selectedAssets.map((asset) => (
                  <article key={asset.id}>
                    <AssetThumbnail asset={asset} />
                    <div>
                      <strong>{asset.name}</strong>
                      <span>{asset.id}</span>
                      <small>{accessoriesFor(asset)} </small>
                    </div>
                    <button onClick={() => toggle(asset.id)} aria-label={`Quitar ${asset.id}`}>
                      <X size={16} />
                    </button>
                  </article>
                ))
              ) : (
                <div className="cart-empty">
                  <ClipboardList size={28} />
                  <strong>Lista vacía</strong>
                  <p>Las herramientas que agregues aparecerán aquí.</p>
                </div>
              )}
            </div>
            <div className="dispatch-summary">
              <span>
                Unidades seleccionadas <strong>{selectedIds.length}</strong>
              </span>
              <span>
                Destino <strong>{destination || "Sin seleccionar"}</strong>
              </span>
            </div>
          </aside>
        </div>
        <div className="modal-foot">
          <div>
            <ShieldCheck size={17} /> Cada unidad cambiará de ubicación automáticamente.
          </div>
          <span>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button disabled={!ready} onClick={() => onConfirm(details)}>
              Confirmar despacho <ArrowRight size={16} />
            </Button>
          </span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={title}
      subtitle="Selecciona las unidades físicas que participarán en el movimiento."
      onClose={onClose}
      wide
    >
      <div className="flow-steps">
        <span className="done">
          <b>1</b> Ruta
        </span>
        <i />
        <span className={destination || flow === "return" ? "done" : ""}>
          <b>2</b> Herramientas
        </span>
        <i />
        <span>
          <b>3</b> Confirmar
        </span>
      </div>
      <div className="modal-body">
        {flow !== "return" && (
          <div className="form-group">
            <label>Trasladar hacia</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)}>
              <option value="">Seleccionar una obra...</option>
              {projects.map((p) => (
                <option key={p.code}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
        <MovementPeopleFields
          responsibles={responsibles}
          deliveredBy={deliveredBy}
          receivedBy={receivedBy}
          movementDate={movementDate}
          observations={observations}
          accessoriesVerified={accessoriesVerified}
          setDeliveredBy={setDeliveredBy}
          setReceivedBy={setReceivedBy}
          setMovementDate={setMovementDate}
          setObservations={setObservations}
          setAccessoriesVerified={setAccessoriesVerified}
        />
        <div className="selection-head">
          <div>
            <label>Unidades disponibles</label>
            <p>
              {assets.length} unidades en {source}
            </p>
          </div>
          <Badge tone="blue">{selectedIds.length} seleccionadas</Badge>
        </div>
        <div className="asset-selector">
          {assets.map((a) => (
            <label key={a.id} className={selectedIds.includes(a.id) ? "selected" : ""}>
              <input
                type="checkbox"
                checked={selectedIds.includes(a.id)}
                onChange={() => toggle(a.id)}
              />
              <span className="custom-check">
                {selectedIds.includes(a.id) && <Check size={14} />}
              </span>
              <span className="quick-icon gray">
                <ToolCase size={18} />
              </span>
              <span>
                <strong>
                  {a.id} · {a.name}
                </strong>
                <small>
                  {a.brand} {a.model} · {a.status}
                </small>
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="modal-foot">
        <div>
          <ShieldCheck size={17} /> Se registrará la trazabilidad de cada unidad.
        </div>
        <span>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={!ready} onClick={() => onConfirm(details)}>
            Confirmar movimiento <ArrowRight size={16} />
          </Button>
        </span>
      </div>
    </Modal>
  );
}

function AssetThumbnail({ asset }: { asset: Asset }) {
  return (
    <div className="asset-thumbnail">
      {asset.photos[0] ? <img src={asset.photos[0].url} alt="" /> : <ToolCase size={20} />}
    </div>
  );
}

function MovementPeopleFields({
  responsibles,
  deliveredBy,
  receivedBy,
  movementDate,
  observations,
  accessoriesVerified,
  setDeliveredBy,
  setReceivedBy,
  setMovementDate,
  setObservations,
  setAccessoriesVerified,
}: {
  responsibles: Responsible[];
  deliveredBy: string;
  receivedBy: string;
  movementDate: string;
  observations: string;
  accessoriesVerified: boolean;
  setDeliveredBy: (value: string) => void;
  setReceivedBy: (value: string) => void;
  setMovementDate: (value: string) => void;
  setObservations: (value: string) => void;
  setAccessoriesVerified: (value: boolean) => void;
}) {
  return (
    <div className="movement-meta-form">
      <SearchableResponsibleSelect
        label="Responsable que entrega"
        value={deliveredBy}
        responsibles={responsibles}
        onChange={setDeliveredBy}
      />
      <SearchableResponsibleSelect
        label="Responsable que recibe"
        value={receivedBy}
        responsibles={responsibles}
        onChange={setReceivedBy}
      />
      <div className="form-group">
        <label>Fecha del movimiento</label>
        <input type="date" value={movementDate} onChange={(e) => setMovementDate(e.target.value)} />
      </div>
      <label className="accessory-check">
        <input
          type="checkbox"
          checked={accessoriesVerified}
          onChange={(e) => setAccessoriesVerified(e.target.checked)}
        />
        <span className="custom-check">{accessoriesVerified && <Check size={14} />}</span>
        <span>
          <strong>Accesorios verificados</strong>
          <small>Se entrega y recibe el conjunto completo</small>
        </span>
      </label>
      <div className="form-group movement-observations">
        <label>Observaciones</label>
        <input
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Novedades o comentarios del movimiento (opcional)"
        />
      </div>
    </div>
  );
}

function SearchableResponsibleSelect({
  label,
  value,
  responsibles,
  onChange,
}: {
  label: string;
  value: string;
  responsibles: Responsible[];
  onChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = responsibles.filter((person) =>
    `${person.name} ${person.role} ${person.project}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="responsible-select form-group">
      <label>{label}</label>
      <div>
        <UserRound size={15} />
        <input
          value={open ? query : value}
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange("");
          }}
          placeholder="Buscar y seleccionar..."
        />
        <ChevronDown size={14} />
        {open && (
          <div className="responsible-options">
            {filtered.map((person) => (
              <button
                key={person.id}
                onMouseDown={() => {
                  onChange(person.name);
                  setQuery("");
                  setOpen(false);
                }}
              >
                <span className="avatar">{initials(person.name)}</span>
                <span>
                  <strong>{person.name}</strong>
                  <small>
                    {person.role} · {person.project || "Sin obra"}
                  </small>
                </span>
                {value === person.name && <Check size={15} />}
              </button>
            ))}
            {!filtered.length && <p>No hay responsables activos coincidentes.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function accessoriesFor(asset: Asset) {
  if (asset.name.toLowerCase().includes("taladro")) return "Accesorios: estuche y empuñadura";
  if (asset.name.toLowerCase().includes("pulidora")) return "Accesorios: guarda y llave";
  if (asset.category === "Seguridad") return "Accesorios: eslinga y mosquetón";
  return "Accesorios verificados";
}

function PhotoUploadModal({
  novelty,
  onClose,
  onSave,
}: {
  novelty: boolean;
  onClose: () => void;
  onSave: (photos: AssetPhoto[]) => void;
}) {
  const [files, setFiles] = useState<{ file: File; description: string }[]>([]);
  const [kind, setKind] = useState<AssetPhoto["kind"]>(novelty ? "Novedad" : "General");
  const allDescribed = files.length > 0 && files.every((item) => item.description.trim());

  return (
    <Modal
      title={novelty ? "Registrar novedad fotográfica" : "Agregar fotografía"}
      subtitle={
        novelty
          ? "Documenta daños, desgaste o una intervención de mantenimiento."
          : "Agrega evidencia visual a la hoja de vida."
      }
      onClose={onClose}
    >
      <div className="modal-body photo-upload-form">
        <label className="upload-zone upload-zone-compact">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setFiles((current) => [
                ...current,
                ...Array.from(e.target.files || []).map((file) => ({ file, description: "" })),
              ])
            }
          />
          <span>
            <Upload size={23} />
          </span>
          <strong>{files.length ? "Agregar más fotografías" : "Seleccionar fotografías"}</strong>
          <p>Selección múltiple · JPG, PNG o WEBP</p>
        </label>
        {files.length > 0 && (
          <div className="upload-batch">
            {files.map((item, index) => (
              <div key={`${item.file.name}-${index}`}>
                <img src={URL.createObjectURL(item.file)} alt="" />
                <label>
                  <span>Descripción de la fotografía {index + 1}</span>
                  <input
                    value={item.description}
                    onChange={(e) =>
                      setFiles((current) =>
                        current.map((entry, currentIndex) =>
                          currentIndex === index
                            ? { ...entry, description: e.target.value }
                            : entry,
                        ),
                      )
                    }
                    placeholder="Describe lo que se observa..."
                  />
                </label>
                <button
                  onClick={() =>
                    setFiles((current) =>
                      current.filter((_, currentIndex) => currentIndex !== index),
                    )
                  }
                  aria-label="Quitar fotografía"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="form-group">
          <label>Tipo de fotografía</label>
          <select
            value={kind}
            disabled={novelty}
            onChange={(e) => setKind(e.target.value as AssetPhoto["kind"])}
          >
            <option>General</option>
            <option>Identificación</option>
            <option>Accesorios</option>
            <option>Novedad</option>
          </select>
        </div>
      </div>
      <div className="modal-foot">
        <div>
          <Camera size={17} /> La imagen quedará vinculada a esta unidad.
        </div>
        <span>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            disabled={!allDescribed}
            onClick={() =>
              onSave(
                files.map((item, index) => ({
                  id: `${Date.now()}-${index}`,
                  url: URL.createObjectURL(item.file),
                  description: item.description.trim(),
                  kind,
                })),
              )
            }
          >
            Guardar {files.length || ""} {files.length === 1 ? "fotografía" : "fotografías"}
          </Button>
        </span>
      </div>
    </Modal>
  );
}

function NewAssetModal({ onClose, onSave }: { onClose: () => void; onSave: (a: Asset) => void }) {
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSave({
      id: String(f.get("id")),
      name: String(f.get("name")),
      category: String(f.get("category")),
      brand: String(f.get("brand")),
      model: String(f.get("model")),
      serial: String(f.get("serial")),
      acquired: String(f.get("date")),
      location: "Bodega principal",
      status: "Disponible",
      photos: [],
    });
  };
  return (
    <Modal
      title="Registrar nueva herramienta"
      subtitle="Crea la hoja de vida de una unidad física."
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="modal-body form-grid">
          <div className="form-group full">
            <label>Tipo de herramienta</label>
            <input name="name" required placeholder="Ej. Taladro rotomartillo" />
          </div>
          <div className="form-group">
            <label>Código interno</label>
            <input name="id" required placeholder="RT-006" />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select name="category">
              <option>Eléctrica</option>
              <option>Escaleras</option>
              <option>Seguridad</option>
              <option>Maquinaria</option>
            </select>
          </div>
          <div className="form-group">
            <label>Marca</label>
            <input name="brand" required placeholder="Bosch" />
          </div>
          <div className="form-group">
            <label>Modelo</label>
            <input name="model" required placeholder="GBH 2-26" />
          </div>
          <div className="form-group">
            <label>Número de serie</label>
            <input name="serial" required placeholder="12350" />
          </div>
          <div className="form-group">
            <label>Fecha de adquisición</label>
            <input name="date" type="date" required />
          </div>
        </div>
        <div className="modal-foot">
          <div>
            <ShieldCheck size={17} /> Ingresará como disponible en bodega.
          </div>
          <span>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar herramienta</Button>
          </span>
        </div>
      </form>
    </Modal>
  );
}

function NewProjectModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (p: Project) => void;
}) {
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSave({
      name: String(f.get("name")),
      code: String(f.get("code")),
      manager: String(f.get("manager")),
      status: "Activa",
    });
  };
  return (
    <Modal
      title="Crear nueva obra"
      subtitle="Registra una nueva ubicación para asignar herramientas."
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <div className="modal-body form-grid">
          <div className="form-group full">
            <label>Nombre de la obra</label>
            <input name="name" required placeholder="Ej. Parque Central" />
          </div>
          <div className="form-group">
            <label>Código</label>
            <input name="code" required placeholder="OB-042" />
          </div>
          <div className="form-group">
            <label>Responsable</label>
            <input name="manager" required placeholder="Nombre completo" />
          </div>
        </div>
        <div className="modal-foot">
          <div>
            <ShieldCheck size={17} /> La obra se creará activa.
          </div>
          <span>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Crear obra</Button>
          </span>
        </div>
      </form>
    </Modal>
  );
}
