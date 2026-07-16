const page = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <title>Subtera — Subscription Analytics Dashboard Concept</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

    :root {
      --canvas:#08090e; --sidebar:#0b0c12; --surface:#11121a; --surface-2:#151722;
      --surface-3:#1b1d29; --border:#262938; --border-strong:#373b4e;
      --text:#f5f3ff; --text-2:#a7a7b5; --muted:#6f7280;
      --violet:#7c5cff; --violet-2:#8b6cff; --lavender:#b49cff; --blue:#5c7cfa;
      --success:#3ddc97; --warning:#f5b942; --danger:#ff6b81; --info:#56b4ff;
      --radius:16px; --control-radius:12px;
    }
    * { box-sizing:border-box; }
    html { background:#05060a; }
    body { margin:0; min-width:320px; color:var(--text); background:
      radial-gradient(circle at 74% -10%, rgba(92,124,250,.11), transparent 28rem),
      radial-gradient(circle at 18% 15%, rgba(124,92,255,.07), transparent 24rem), #05060a;
      font-family:'Manrope', ui-sans-serif, system-ui, sans-serif; font-size:14px; }
    button, input { font:inherit; }
    button { color:inherit; }
    svg { display:block; }
    .icon { width:18px; height:18px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; flex:0 0 auto; }
    .icon.sm { width:15px; height:15px; }
    .icon.lg { width:22px; height:22px; }

    .prototype-nav { position:sticky; top:0; z-index:100; height:68px; display:flex; align-items:center; gap:22px;
      padding:0 24px; background:rgba(7,8,13,.92); border-bottom:1px solid #20222d; backdrop-filter:blur(18px); }
    .prototype-brand { display:flex; align-items:center; gap:10px; min-width:210px; font-weight:800; letter-spacing:-.02em; }
    .prototype-brand span:last-child { color:var(--text-2); font-size:12px; font-weight:600; letter-spacing:0; }
    .brand-mark { width:31px; height:31px; border-radius:10px; display:grid; place-items:center; color:white;
      background:linear-gradient(145deg,#9a7aff,#6245ef); box-shadow:0 0 24px rgba(124,92,255,.35); }
    .tabs { display:flex; align-items:center; gap:6px; padding:5px; border:1px solid #252733; border-radius:12px; background:#0e0f16; overflow:auto; }
    .tab { border:0; background:transparent; padding:9px 14px; border-radius:8px; color:#8f919e; white-space:nowrap; cursor:pointer; font-size:12px; font-weight:700; }
    .tab:hover { color:#d7d3e7; background:#151721; }
    .tab.active { color:white; background:#20212c; box-shadow:inset 0 0 0 1px #2e3040; }
    .prototype-note { margin-left:auto; color:#707381; font-size:11px; white-space:nowrap; }
    .view { display:none; }
    .view.active { display:block; }
    .stage { min-height:calc(100vh - 68px); overflow:auto; padding:34px; }
    .stage.center { display:flex; justify-content:center; align-items:flex-start; }
    .artboard { position:relative; flex:none; overflow:hidden; border:1px solid #272936; background:var(--canvas); box-shadow:0 40px 100px rgba(0,0,0,.45); }

    /* Shared application components */
    .app-btn { min-height:40px; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:0 14px;
      border:1px solid var(--border); border-radius:var(--control-radius); background:var(--surface-2); color:#dedbe8; font-size:12px; font-weight:700; cursor:default; }
    .app-btn.ghost { background:transparent; }
    .app-btn.primary { background:var(--violet); border-color:#8d72ff; color:white; box-shadow:0 8px 24px rgba(124,92,255,.18); }
    .icon-btn { width:40px; height:40px; border:1px solid var(--border); border-radius:12px; background:var(--surface-2); display:grid; place-items:center; color:#b4b3c0; position:relative; }
    .notify-dot { position:absolute; top:8px; right:8px; width:5px; height:5px; border-radius:50%; background:var(--violet); box-shadow:0 0 8px var(--violet); }
    .search { height:42px; display:flex; align-items:center; gap:10px; padding:0 12px; color:#777a88; border:1px solid #242632; border-radius:12px; background:#101118; }
    .search .shortcut { margin-left:auto; padding:3px 6px; border:1px solid #30323d; border-radius:6px; color:#656876; font-size:10px; }
    .workspace { display:flex; align-items:center; gap:11px; min-height:56px; padding:9px 10px; border:1px solid #262833; border-radius:13px; background:#12131b; }
    .workspace-logo { width:36px; height:36px; border-radius:10px; display:grid; place-items:center; background:linear-gradient(145deg,rgba(124,92,255,.28),rgba(92,124,250,.12)); border:1px solid rgba(139,108,255,.32); color:#b9a7ff; }
    .workspace-copy { min-width:0; flex:1; }
    .eyebrow { color:#747684; text-transform:uppercase; letter-spacing:.09em; font-size:9px; font-weight:800; }
    .workspace-name { margin-top:3px; color:#e9e6f2; font-size:12px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .nav-group { display:grid; gap:5px; }
    .nav-item { min-height:42px; display:flex; align-items:center; gap:11px; padding:0 12px; border-radius:11px; color:#8b8d99; position:relative; font-size:12px; font-weight:600; }
    .nav-item.active { color:#eeeaff; background:linear-gradient(90deg,rgba(124,92,255,.15),rgba(124,92,255,.04)); box-shadow:inset 0 0 0 1px rgba(124,92,255,.18); }
    .nav-item.active:before { content:""; position:absolute; left:0; width:2px; height:20px; border-radius:2px; background:var(--violet); box-shadow:0 0 12px rgba(124,92,255,.7); }
    .nav-item.active .icon { color:#a58eff; }
    .profile-row { min-height:60px; display:flex; align-items:center; gap:11px; padding:10px; border:1px solid #252732; border-radius:13px; background:#111219; }
    .avatar { width:36px; height:36px; display:grid; place-items:center; border-radius:50%; color:#eeeaff; background:linear-gradient(145deg,#514975,#2a3149); border:1px solid #5e5a78; font-size:11px; font-weight:800; }
    .profile-copy { min-width:0; flex:1; }
    .profile-name { font-size:12px; font-weight:700; color:#e7e4ee; }
    .profile-role { margin-top:3px; font-size:9px; color:#777987; }

    .card { background:linear-gradient(180deg,rgba(20,21,30,.98),rgba(15,16,23,.98)); border:1px solid var(--border); border-radius:var(--radius); }
    .card-header { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; }
    .card-title { font-size:15px; font-weight:700; letter-spacing:-.015em; }
    .card-subtitle { margin-top:5px; color:var(--muted); font-size:10px; line-height:1.5; }
    .trend { display:inline-flex; align-items:center; gap:5px; padding:5px 8px; border-radius:999px; font-size:10px; font-weight:800; white-space:nowrap; }
    .trend.positive { color:#72e6b2; background:rgba(61,220,151,.11); border:1px solid rgba(61,220,151,.18); }
    .trend.negative { color:#ff8ea0; background:rgba(255,107,129,.1); border:1px solid rgba(255,107,129,.16); }
    .trend.improve { color:#72e6b2; background:rgba(61,220,151,.11); border:1px solid rgba(61,220,151,.18); }
    .status { display:inline-flex; align-items:center; gap:6px; padding:5px 8px; border-radius:999px; font-size:9px; font-weight:800; white-space:nowrap; }
    .status:before { content:""; width:5px; height:5px; border-radius:50%; background:currentColor; }
    .paid { color:#66dda8; background:#123126; }
    .pending { color:#efc45c; background:#332a13; }
    .refunded { color:#75bcf2; background:#142b3a; }
    .failed { color:#ff8094; background:#381820; }
    .segment { display:flex; align-items:center; padding:3px; border:1px solid #282a36; border-radius:10px; background:#0d0e14; }
    .segment span { padding:7px 10px; color:#656876; border-radius:7px; font-size:9px; font-weight:800; }
    .segment .active { color:#eeeaff; background:#22232e; box-shadow:inset 0 0 0 1px #303240; }

    /* Desktop view */
    .desktop-artboard { width:1440px; height:1260px; display:grid; grid-template-columns:248px 1fr; grid-template-rows:72px 1fr; }
    .desktop-artboard:after { content:""; position:absolute; pointer-events:none; width:560px; height:420px; right:-180px; top:-220px; background:radial-gradient(circle,rgba(124,92,255,.10),rgba(92,124,250,.03) 42%,transparent 70%); }
    .sidebar { grid-row:1 / span 2; display:flex; flex-direction:column; padding:22px 18px 18px; background:var(--sidebar); border-right:1px solid #1e202a; z-index:2; }
    .app-logo { height:38px; display:flex; align-items:center; gap:10px; font-size:17px; font-weight:800; letter-spacing:-.04em; }
    .app-logo .brand-mark { width:28px; height:28px; border-radius:9px; }
    .sidebar .workspace { margin-top:20px; }
    .sidebar .search { margin-top:12px; }
    .nav-label { margin:22px 12px 8px; color:#5e606d; font-size:9px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; }
    .sidebar-bottom { margin-top:auto; }
    .sidebar-bottom .profile-row { margin-top:12px; }
    .topbar { grid-column:2; height:72px; display:flex; align-items:center; padding:0 32px; background:rgba(11,12,18,.92); border-bottom:1px solid #1e202a; z-index:2; }
    .breadcrumb { display:flex; align-items:center; gap:9px; font-size:12px; font-weight:600; color:#686b79; }
    .breadcrumb strong { color:#c9c6d4; }
    .crumb-sep { color:#444754; }
    .top-actions { margin-left:auto; display:flex; align-items:center; gap:9px; }
    .top-profile { display:flex; align-items:center; gap:9px; margin-left:4px; padding-left:13px; border-left:1px solid #282a34; }
    .top-profile .avatar { width:32px; height:32px; }
    .main-content { grid-column:2; min-width:0; padding:28px 32px 32px; overflow:hidden; z-index:1; }
    .page-heading { height:68px; display:flex; align-items:center; justify-content:space-between; }
    .page-heading h1 { margin:0; font-size:28px; line-height:1.2; letter-spacing:-.04em; }
    .page-heading p { margin:7px 0 0; color:#787a88; font-size:11px; }
    .heading-actions { display:flex; gap:9px; }
    .date-btn { min-width:184px; justify-content:space-between; }
    .kpi-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-top:20px; }
    .kpi { height:150px; padding:19px 19px 17px; position:relative; overflow:hidden; }
    .kpi.highlight { border-color:rgba(124,92,255,.42); box-shadow:0 0 0 1px rgba(124,92,255,.08),0 0 38px rgba(124,92,255,.10); }
    .kpi.highlight:after { content:""; position:absolute; width:170px; height:120px; right:-60px; top:-68px; background:radial-gradient(circle,rgba(124,92,255,.18),transparent 68%); }
    .kpi-top { display:flex; align-items:center; justify-content:space-between; color:#989aa8; }
    .kpi-label { font-size:10px; font-weight:700; }
    .metric-icon { width:30px; height:30px; display:grid; place-items:center; border:1px solid #2d2f3a; border-radius:9px; background:#161720; color:#8f91a0; }
    .highlight .metric-icon { color:#ae9aff; border-color:rgba(124,92,255,.25); background:rgba(124,92,255,.09); }
    .kpi-value { margin-top:10px; font-size:27px; line-height:1; letter-spacing:-.045em; font-weight:700; }
    .kpi-foot { margin-top:13px; display:flex; align-items:center; gap:8px; }
    .kpi-note { color:#676a78; font-size:9px; }
    .spark { position:absolute; width:78px; height:30px; right:17px; bottom:14px; opacity:.82; }
    .analytics-row { display:grid; grid-template-columns:2fr 1fr; gap:20px; margin-top:20px; }
    .analytics-row.lower { grid-template-columns:1fr 2fr; }
    .analytics-card { height:390px; padding:22px; overflow:hidden; }
    .lower .analytics-card { height:400px; }
    .revenue-total { display:flex; align-items:baseline; gap:11px; margin-top:18px; }
    .revenue-total strong { font-size:29px; letter-spacing:-.045em; }
    .revenue-total span:last-child { color:#686b78; font-size:9px; }
    .chart-wrap { position:relative; margin-top:10px; height:244px; }
    .chart-wrap svg { width:100%; height:100%; overflow:visible; }
    .chart-label { fill:#616472; font-size:9px; font-family:'Manrope',sans-serif; }
    .chart-grid { stroke:#252733; stroke-width:1; }
    .chart-current { fill:none; stroke:var(--violet-2); stroke-width:2.5; filter:drop-shadow(0 0 5px rgba(124,92,255,.34)); }
    .chart-previous { fill:none; stroke:#555968; stroke-width:1.5; stroke-dasharray:5 6; }
    .focus-line { stroke:rgba(180,156,255,.38); stroke-dasharray:3 5; }
    .tooltip-box { fill:#1a1b25; stroke:#343746; }
    .tooltip-title { fill:#8d8f9e; font-size:9px; font-weight:700; font-family:'Manrope',sans-serif; }
    .tooltip-copy { fill:#e7e4ee; font-size:9px; font-weight:700; font-family:'Manrope',sans-serif; }
    .tooltip-good { fill:#67dda9; font-size:9px; font-weight:800; font-family:'Manrope',sans-serif; }
    .customer-top { margin-top:19px; display:flex; align-items:flex-end; gap:10px; }
    .customer-top strong { font-size:28px; letter-spacing:-.04em; }
    .customer-chart { height:178px; margin-top:4px; }
    .customer-chart svg { width:100%; height:100%; }
    .legend { display:flex; align-items:center; gap:14px; color:#777987; font-size:9px; }
    .legend i { width:7px; height:7px; display:inline-block; border-radius:50%; margin-right:5px; }
    .customer-summary { display:grid; grid-template-columns:repeat(3,1fr); border-top:1px solid #282a34; margin-top:1px; padding-top:14px; }
    .summary-item + .summary-item { padding-left:12px; border-left:1px solid #282a34; }
    .summary-item span { color:#686b78; font-size:8px; }
    .summary-item strong { display:block; margin-top:5px; font-size:15px; }
    .plans-body { display:flex; align-items:center; gap:23px; margin-top:19px; }
    .donut { width:146px; height:146px; flex:0 0 auto; border-radius:50%; position:relative; background:conic-gradient(#7c5cff 0 46.6%,#a58fff 46.6% 78.2%,#5c6fba 78.2% 94.1%,#3a3e50 94.1% 100%); box-shadow:0 0 28px rgba(124,92,255,.08); }
    .donut:after { content:""; position:absolute; inset:26px; border-radius:50%; background:#11121a; border:1px solid #272936; }
    .donut-center { position:absolute; inset:0; z-index:1; display:grid; place-content:center; text-align:center; }
    .donut-center strong { font-size:20px; letter-spacing:-.04em; }
    .donut-center span { margin-top:3px; color:#6f7280; font-size:8px; }
    .plan-list { flex:1; display:grid; gap:12px; }
    .plan-row { display:grid; grid-template-columns:1fr auto; gap:7px; align-items:center; }
    .plan-name { display:flex; align-items:center; gap:7px; font-size:9px; font-weight:700; }
    .plan-dot { width:7px; height:7px; border-radius:2px; }
    .plan-meta { color:#777987; font-size:8px; }
    .plan-value { text-align:right; font-size:9px; font-weight:700; }
    .plan-value small { display:block; color:#656876; font-size:7px; font-weight:500; margin-top:3px; }
    .transaction-table { margin-top:17px; }
    .transaction-head,.transaction-row { display:grid; grid-template-columns:1.55fr .72fr .92fr 1.1fr .67fr .7fr; align-items:center; gap:10px; }
    .transaction-head { height:29px; padding:0 10px; color:#5f6270; font-size:8px; text-transform:uppercase; letter-spacing:.07em; font-weight:800; }
    .transaction-row { min-height:52px; padding:0 10px; border-top:1px solid #242630; font-size:9px; color:#a7a7b5; }
    .customer-cell { display:flex; align-items:center; gap:9px; min-width:0; color:#e1deea; font-weight:700; }
    .customer-cell .avatar { width:27px; height:27px; font-size:8px; }
    .customer-cell span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .amount { color:#eeeaf6; font-weight:800; text-align:right; }

    /* Analytics desktop */
    .analytics-page .page-heading { height:68px; }
    .compare-btn { min-width:184px; }
    .analysis-metric-strip { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:15px; }
    .analysis-metric { min-height:54px; padding:10px 12px; border:1px solid #262833; border-radius:11px; background:#0e0f16; }
    .analysis-metric-label { display:flex; align-items:center; justify-content:space-between; color:#727583; font-size:8px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; }
    .analysis-metric-value { display:flex; align-items:baseline; gap:8px; margin-top:5px; }
    .analysis-metric-value strong { font-size:19px; letter-spacing:-.035em; }
    .analysis-metric-value span { color:#6e7180; font-size:8px; }
    .analysis-chart { height:205px; margin-top:8px; }
    .analysis-chart svg { width:100%; height:100%; overflow:visible; }
    .growth-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:16px; }
    .growth-stat { padding:10px 8px; border:1px solid #272934; border-radius:10px; background:#0f1017; }
    .growth-stat span { color:#696c79; font-size:8px; }
    .growth-stat strong { display:block; margin-top:5px; font-size:17px; letter-spacing:-.025em; }
    .growth-chart { height:190px; margin-top:9px; }
    .growth-chart svg { width:100%; height:100%; }
    .growth-compare { display:flex; align-items:center; justify-content:space-between; margin-top:2px; padding-top:11px; border-top:1px solid #272934; color:#707381; font-size:8px; }
    .retention-hero { display:flex; align-items:flex-end; justify-content:space-between; margin-top:19px; }
    .retention-rate span { display:block; color:#6e7180; font-size:8px; }
    .retention-rate strong { display:block; margin-top:5px; font-size:30px; letter-spacing:-.045em; }
    .retention-chart { height:126px; margin-top:8px; }
    .retention-chart svg { width:100%; height:100%; }
    .retention-details { display:grid; grid-template-columns:1fr 1fr; gap:9px; margin-top:9px; }
    .retention-detail { padding:11px; border:1px solid #272934; border-radius:10px; background:#0f1017; }
    .retention-detail span { color:#696c79; font-size:8px; }
    .retention-detail strong { display:block; margin-top:5px; font-size:16px; }
    .positive-note { display:flex; align-items:center; gap:6px; margin-top:11px; color:#73dcae; font-size:8px; font-weight:700; }
    .positive-note:before { content:""; width:6px; height:6px; border-radius:50%; background:#3ddc97; box-shadow:0 0 8px rgba(61,220,151,.3); }
    .plan-performance { margin-top:15px; }
    .plan-performance-head,.plan-performance-row { display:grid; grid-template-columns:1.12fr .55fr .8fr .76fr .86fr 1.02fr .62fr .64fr; gap:8px; align-items:center; }
    .plan-performance-head { min-height:31px; padding:0 10px; color:#5f6270; font-size:7px; font-weight:800; text-transform:uppercase; letter-spacing:.065em; }
    .plan-performance-row { min-height:53px; padding:0 10px; border-top:1px solid #242630; color:#a2a4b1; font-size:9px; }
    .plan-performance-row.total { min-height:46px; background:#0e0f15; color:#dedbe8; font-weight:800; }
    .plan-cell { display:flex; align-items:center; gap:8px; color:#e6e3ee; font-weight:700; }
    .plan-cell .plan-dot { width:8px; height:8px; }
    .contribution { display:flex; align-items:center; gap:7px; }
    .contribution-track { width:46px; height:4px; overflow:hidden; border-radius:99px; background:#282a35; }
    .contribution-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,#6e54db,#9a82ff); }
    .table-trend { color:#66dba7; font-size:8px; font-weight:800; }

    /* Customers desktop */
    .customer-search { width:220px; }
    .customer-search input { width:100%; min-width:0; border:0; outline:0; color:#d9d6e3; background:transparent; font:inherit; font-size:11px; }
    .customer-search input::placeholder { color:#696c79; }
    .customer-segment-card { height:84px; display:flex; align-items:center; justify-content:space-between; gap:24px; margin-top:20px; padding:15px 18px; }
    .customer-tabs { display:flex; align-items:center; gap:4px; padding:4px; border:1px solid #272934; border-radius:11px; background:#0d0e14; }
    .customer-tab { min-width:64px; height:34px; display:grid; place-items:center; padding:0 11px; border-radius:8px; color:#6e7180; font-size:9px; font-weight:800; }
    .customer-tab.active { color:#eeeaff; background:#22232e; box-shadow:inset 0 0 0 1px #313342; }
    .risk-filter-chip { display:flex; align-items:center; gap:7px; height:32px; padding:0 10px; border:1px solid rgba(245,185,66,.22); border-radius:9px; color:#d4b76f; background:rgba(53,42,18,.42); font-size:8px; font-weight:800; white-space:nowrap; }
    .risk-filter-chip:before { content:""; width:6px; height:6px; border-radius:50%; background:#f5b942; }
    .risk-filter-chip small { color:#837c6c; font-size:7px; font-weight:600; }
    .segment-summary { display:flex; align-items:center; margin-left:auto; }
    .segment-summary-item { min-width:102px; padding:0 16px; border-left:1px solid #292b36; }
    .segment-summary-item span { display:block; color:#696c79; font-size:8px; }
    .segment-summary-item strong { display:block; margin-top:5px; font-size:14px; }
    .customer-table-card { height:616px; margin-top:20px; padding:0; overflow:hidden; }
    .customer-table-toolbar { height:62px; display:flex; align-items:center; justify-content:space-between; padding:0 20px; border-bottom:1px solid #272934; }
    .customer-table-toolbar h2 { margin:0; font-size:15px; letter-spacing:-.015em; }
    .customer-table-toolbar p { margin:4px 0 0; color:#696c79; font-size:8px; }
    .table-view-control { display:flex; align-items:center; gap:8px; color:#6e7180; font-size:8px; }
    .customers-table-head,.customers-table-row { display:grid; grid-template-columns:1.18fr 1.05fr .64fr .76fr .72fr .82fr .86fr .28fr; align-items:center; gap:10px; }
    .customers-table-head { height:35px; padding:0 18px; color:#5f6270; background:#0e0f15; font-size:7px; font-weight:800; text-transform:uppercase; letter-spacing:.065em; }
    .sort-label { display:flex; align-items:center; gap:5px; color:#8e90a0; }
    .customers-table-row { min-height:55px; padding:0 18px; border-top:1px solid #242630; color:#9c9eab; font-size:9px; position:relative; }
    .customers-table-row.selected { background:linear-gradient(90deg,rgba(124,92,255,.10),rgba(124,92,255,.025)); box-shadow:inset 2px 0 #7c5cff; }
    .customers-table-row.selected:after { content:"Selected"; position:absolute; right:50px; top:6px; color:#725fe0; font-size:6px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; }
    .customer-identity { display:flex; align-items:center; gap:9px; min-width:0; }
    .customer-identity .avatar { width:29px; height:29px; font-size:8px; }
    .customer-identity strong { display:block; overflow:hidden; color:#e5e2ec; font-size:9px; white-space:nowrap; text-overflow:ellipsis; }
    .company-cell { overflow:hidden; color:#b0b1bd; white-space:nowrap; text-overflow:ellipsis; }
    .plan-badge { display:inline-flex; align-items:center; gap:6px; font-weight:700; color:#b9bac6; }
    .plan-badge:before { content:""; width:6px; height:6px; border-radius:2px; background:#777a89; }
    .plan-badge.growth:before { background:#a58fff; }
    .plan-badge.teams:before { background:#454b63; }
    .plan-badge.pro:before { background:#5c6fba; }
    .plan-badge.starter:before { background:#7c5cff; }
    .status-active { color:#66dda8; background:#123126; }
    .status-trial { color:#77bff4; background:#142b3a; }
    .status-risk { color:#efc45c; background:#332a13; }
    .status-due { color:#ff8799; background:#381820; }
    .status-churned { color:#8f919e; background:#22242e; }
    .row-action { width:28px; height:28px; display:grid; place-items:center; border:1px solid transparent; border-radius:8px; color:#696c79; font-size:16px; letter-spacing:1px; }
    .selected .row-action { border-color:#333545; background:#191a24; color:#a8a9b5; }
    .table-footer { height:64px; display:flex; align-items:center; padding:0 18px; border-top:1px solid #292b36; color:#6e7180; font-size:9px; }
    .rows-select { display:flex; align-items:center; gap:9px; margin-left:22px; padding-left:22px; border-left:1px solid #292b36; }
    .rows-select span:last-child { display:flex; align-items:center; gap:6px; padding:7px 9px; border:1px solid #2c2e3a; border-radius:8px; color:#a3a5b2; background:#11121a; }
    .pagination { display:flex; align-items:center; gap:5px; margin-left:auto; }
    .page-btn { min-width:28px; height:28px; display:grid; place-items:center; border:1px solid #2a2c38; border-radius:8px; color:#747784; background:#11121a; font-size:8px; font-weight:700; }
    .page-btn.active { color:#eeeaff; border-color:rgba(124,92,255,.38); background:rgba(124,92,255,.14); }
    .page-ellipsis { padding:0 4px; color:#565966; }

    /* Subscriptions desktop */
    .subscriptions-performance-row { display:grid; grid-template-columns:2fr 1fr; gap:20px; margin-top:20px; }
    .subscription-plan-card,.subscription-status-card { height:300px; padding:20px; overflow:hidden; }
    .subscription-plan-table { margin-top:13px; }
    .subscription-plan-head,.subscription-plan-row { display:grid; grid-template-columns:1.04fr .54fr .72fr .68fr .82fr .58fr .62fr; align-items:center; gap:8px; }
    .subscription-plan-head { min-height:28px; padding:0 9px; color:#5f6270; font-size:7px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; }
    .subscription-plan-row { min-height:43px; padding:0 9px; border-top:1px solid #242630; color:#a1a3b0; font-size:9px; }
    .subscription-plan-row.total { min-height:40px; color:#e2dfea; background:#0e0f15; font-weight:800; }
    .status-visual { display:flex; align-items:center; gap:20px; margin-top:17px; }
    .status-donut { width:132px; height:132px; flex:0 0 auto; position:relative; border-radius:50%; background:conic-gradient(#7c5cff 0 89.95%,#a58fff 89.95% 96.71%,#ff7a90 96.71% 98.70%,#5c6f8f 98.70% 100%); box-shadow:0 0 26px rgba(124,92,255,.07); }
    .status-donut:after { content:""; position:absolute; inset:24px; border:1px solid #272936; border-radius:50%; background:#11121a; }
    .status-donut-center { position:absolute; inset:0; z-index:1; display:grid; place-content:center; text-align:center; }
    .status-donut-center strong { font-size:19px; letter-spacing:-.04em; }
    .status-donut-center span { margin-top:3px; color:#6f7280; font-size:7px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; }
    .status-legend { flex:1; display:grid; gap:8px; }
    .status-legend-row { display:grid; grid-template-columns:1fr auto; align-items:center; gap:8px; color:#8f919e; font-size:8px; }
    .status-legend-label { display:flex; align-items:center; gap:7px; }
    .status-legend-label i { width:7px; height:7px; border-radius:2px; }
    .status-legend-row strong { color:#e2dfeb; font-size:9px; }
    .status-context { margin-top:14px; padding-top:12px; border-top:1px solid #272934; color:#686b78; font-size:8px; line-height:1.5; }
    .status-period-metrics { display:grid; grid-template-columns:1.55fr .9fr; gap:8px; margin-top:12px; padding-top:11px; border-top:1px solid #272934; }
    .status-period-metric { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 9px; border:1px solid #272934; border-radius:9px; background:#0f1017; }
    .status-period-metric span { color:#696c79; font-size:7px; }
    .status-period-metric strong { color:#e2dfeb; font-size:10px; white-space:nowrap; }
    .subscription-table-card { height:520px; margin-top:20px; padding:0; overflow:hidden; }
    .subscription-table-toolbar { height:60px; display:flex; align-items:center; justify-content:space-between; gap:18px; padding:0 18px; border-bottom:1px solid #272934; }
    .subscription-table-toolbar h2 { margin:0; font-size:15px; letter-spacing:-.015em; }
    .subscription-table-toolbar p { margin:4px 0 0; color:#696c79; font-size:8px; }
    .subscription-table-tools { display:flex; align-items:center; gap:7px; }
    .subscription-table-tools .search { width:190px; height:34px; }
    .subscription-table-tools .search input { width:100%; min-width:0; border:0; outline:0; color:#d9d6e3; background:transparent; font:inherit; font-size:9px; }
    .subscription-table-tools .search input::placeholder { color:#696c79; }
    .compact-select { height:34px; min-height:34px; padding:0 10px; font-size:9px; }
    .subscriptions-table-head,.subscriptions-table-row { display:grid; grid-template-columns:1.16fr .64fr .72fr .72fr .8fr .82fr .74fr .25fr; align-items:center; gap:10px; }
    .subscriptions-table-head { height:34px; padding:0 18px; color:#5f6270; background:#0e0f15; font-size:7px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; }
    .subscriptions-table-row { min-height:45px; padding:0 18px; border-top:1px solid #242630; color:#9c9eab; font-size:9px; }
    .subscriptions-table-row.selected { background:linear-gradient(90deg,rgba(124,92,255,.09),rgba(124,92,255,.02)); box-shadow:inset 2px 0 #7c5cff; }
    .billing-cycle { display:inline-flex; align-items:center; width:max-content; padding:4px 7px; border:1px solid #2b2d39; border-radius:7px; color:#9d9fac; background:#11121a; font-size:8px; font-weight:700; }
    .status-paused { color:#8fb0c8; background:#172731; }
    .status-canceled { color:#8f919e; background:#22242e; }
    .subscription-amount { color:#e7e4ee; font-weight:800; }
    .subscription-amount small { display:block; margin-top:2px; color:#686b78; font-size:7px; font-weight:500; }
    .subscription-table-card .table-footer { height:54px; }

    /* Settings desktop */
    .settings-subnav { height:52px; display:flex; align-items:center; gap:4px; margin-top:20px; padding:6px; }
    .settings-subnav-item { height:38px; display:flex; align-items:center; padding:0 16px; border-radius:9px; color:#747784; font-size:9px; font-weight:800; }
    .settings-subnav-item.active { color:#eeeaff; background:linear-gradient(90deg,rgba(124,92,255,.14),rgba(124,92,255,.05)); box-shadow:inset 0 0 0 1px rgba(124,92,255,.20); }
    .settings-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; align-items:start; margin-top:20px; }
    .settings-column { display:grid; gap:16px; }
    .settings-card { padding:20px; overflow:hidden; }
    .workspace-settings { height:380px; }
    .regional-settings { height:320px; }
    .reporting-settings { height:320px; }
    .notification-settings { height:320px; }
    .privacy-settings { height:200px; }
    .danger-settings { height:144px; border-color:rgba(255,107,129,.18); background:linear-gradient(180deg,rgba(24,18,24,.98),rgba(16,15,21,.98)); }
    .settings-section-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
    .settings-section-heading h2 { margin:0; font-size:14px; letter-spacing:-.015em; }
    .settings-section-heading p { margin:5px 0 0; color:#6d707e; font-size:8px; line-height:1.5; }
    .logo-setting { display:flex; align-items:center; gap:14px; margin-top:17px; padding-bottom:15px; border-bottom:1px solid #272934; }
    .logo-upload { width:52px; height:52px; display:grid; place-items:center; border:1px dashed rgba(124,92,255,.42); border-radius:14px; color:#eeeaff; background:linear-gradient(145deg,rgba(124,92,255,.24),rgba(92,124,250,.08)); box-shadow:0 0 20px rgba(124,92,255,.08); font-size:18px; font-weight:800; }
    .logo-setting-copy { flex:1; }
    .logo-setting-copy strong { display:block; font-size:10px; }
    .logo-setting-copy span { display:block; margin-top:4px; color:#696c79; font-size:8px; }
    .field-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:14px; }
    .field { min-width:0; }
    .field.span-2 { grid-column:1 / -1; }
    .field-label { display:block; margin-bottom:6px; color:#888a98; font-size:8px; font-weight:700; }
    .field-control { width:100%; height:38px; display:flex; align-items:center; justify-content:space-between; gap:8px; padding:0 11px; border:1px solid #2a2c38; border-radius:10px; color:#dbd8e4; background:#101118; font-size:9px; }
    input.field-control { outline:0; }
    .field-control.disabled { color:#656876; background:#0d0e13; border-color:#22242d; }
    .field-helper { display:block; margin-top:5px; color:#606370; font-size:7px; line-height:1.4; }
    .regional-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:17px; }
    .info-message { display:flex; align-items:flex-start; gap:8px; margin-top:14px; padding:10px 11px; border:1px solid rgba(86,180,255,.18); border-radius:10px; color:#8ebbd8; background:rgba(19,42,56,.48); font-size:7px; line-height:1.5; }
    .info-message i { width:15px; height:15px; flex:0 0 auto; display:grid; place-items:center; border:1px solid #31546b; border-radius:50%; font-style:normal; font-size:8px; }
    .setting-list { margin-top:13px; }
    .setting-row { min-height:47px; display:flex; align-items:center; gap:14px; border-top:1px solid #262833; }
    .setting-row:first-child { border-top:0; }
    .setting-row-copy { min-width:0; flex:1; }
    .setting-row-copy strong { display:block; color:#cfccd7; font-size:9px; }
    .setting-row-copy span { display:block; margin-top:4px; color:#686b78; font-size:7px; line-height:1.35; }
    .inline-select { min-width:136px; height:32px; display:flex; align-items:center; justify-content:space-between; gap:9px; padding:0 9px; border:1px solid #2a2c38; border-radius:9px; color:#a9aab6; background:#101118; font-size:8px; font-weight:700; }
    .toggle { width:35px; height:19px; flex:0 0 auto; position:relative; border-radius:999px; border:1px solid #343643; background:#22242d; }
    .toggle:after { content:""; position:absolute; width:13px; height:13px; left:2px; top:2px; border-radius:50%; background:#747784; transition:none; }
    .toggle.on { border-color:rgba(124,92,255,.48); background:rgba(124,92,255,.28); box-shadow:0 0 12px rgba(124,92,255,.08); }
    .toggle.on:after { left:18px; background:#a893ff; box-shadow:0 0 7px rgba(124,92,255,.5); }
    .privacy-actions { display:flex; gap:8px; margin-top:16px; }
    .privacy-meta { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px; }
    .privacy-meta-item { padding:11px; border:1px solid #272934; border-radius:10px; background:#0f1017; }
    .privacy-meta-item span { display:block; color:#696c79; font-size:7px; }
    .privacy-meta-item strong { display:block; margin-top:5px; color:#d4d1dc; font-size:9px; }
    .danger-body { display:flex; align-items:center; gap:18px; margin-top:15px; padding-top:14px; border-top:1px solid rgba(255,107,129,.12); }
    .danger-body p { flex:1; margin:0; color:#7f7d88; font-size:8px; line-height:1.5; }
    .danger-btn { min-height:36px; border-color:rgba(255,107,129,.28); color:#ff8ea0; background:rgba(255,107,129,.07); }

    /* Mobile overview */
    .mobile-stage { gap:32px; }
    .phone-artboard { width:390px; min-height:844px; border-radius:24px; background:var(--canvas); overflow:hidden; box-shadow:0 32px 90px rgba(0,0,0,.48); }
    .mobile-page { min-height:2550px; padding-bottom:24px; background:radial-gradient(circle at 90% -5%,rgba(124,92,255,.11),transparent 280px),var(--canvas); }
    .mobile-bar { height:64px; display:flex; align-items:center; padding:0 16px; background:rgba(10,11,17,.96); border-bottom:1px solid #20222c; }
    .mobile-bar .app-logo { height:auto; font-size:15px; }
    .mobile-actions { margin-left:auto; display:flex; gap:8px; }
    .mobile-actions .icon-btn { width:36px; height:36px; }
    .mobile-content { padding:20px 16px 0; }
    .mobile-heading h1 { margin:0; font-size:24px; letter-spacing:-.04em; }
    .mobile-heading p { margin:7px 0 0; color:#747684; font-size:10px; line-height:1.5; }
    .mobile-date { width:100%; margin-top:16px; height:44px; justify-content:space-between; }
    .mobile-kpis { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-top:16px; }
    .mobile-kpis .kpi { height:136px; padding:15px; }
    .mobile-kpis .kpi-label { width:115px; line-height:1.35; }
    .mobile-kpis .metric-icon { display:none; }
    .mobile-kpis .kpi-value { font-size:22px; margin-top:14px; }
    .mobile-kpis .kpi-foot { margin-top:10px; gap:5px; }
    .mobile-kpis .trend { padding:4px 6px; font-size:8px; }
    .mobile-kpis .kpi-note { display:none; }
    .mobile-kpis .spark { width:58px; height:24px; right:12px; bottom:11px; opacity:.6; }
    .mobile-card { margin-top:14px; padding:18px 16px; }
    .mobile-revenue { height:348px; }
    .mobile-revenue .revenue-total { margin-top:15px; }
    .mobile-revenue .revenue-total strong { font-size:25px; }
    .mobile-revenue .chart-wrap { height:205px; margin-top:8px; }
    .mobile-customer { height:335px; }
    .mobile-customer .customer-chart { height:165px; }
    .mobile-plans { min-height:430px; }
    .mobile-plans .plans-body { flex-direction:column; align-items:stretch; }
    .mobile-plans .donut { align-self:center; width:154px; height:154px; }
    .mobile-plans .plan-list { margin-top:4px; }
    .mobile-transactions { min-height:455px; }
    .mobile-transaction-list { margin-top:14px; }
    .mobile-transaction { display:grid; grid-template-columns:1fr auto; gap:8px; align-items:center; padding:14px 0; border-top:1px solid #252732; }
    .mobile-transaction:first-child { border-top:0; }
    .mobile-customer-cell { display:flex; align-items:center; gap:9px; }
    .mobile-customer-cell .avatar { width:31px; height:31px; font-size:8px; }
    .mobile-customer-copy strong { display:block; color:#e6e3ed; font-size:10px; }
    .mobile-customer-copy span { display:block; color:#686b78; font-size:8px; margin-top:4px; }
    .mobile-amount { text-align:right; }
    .mobile-amount strong { display:block; font-size:11px; }
    .mobile-amount .status { margin-top:5px; }

    /* Drawer */
    .drawer-artboard { width:390px; height:844px; border-radius:24px; background:#151621; overflow:hidden; }
    .drawer-backdrop-content { position:absolute; inset:0; padding:84px 20px 20px 324px; opacity:.22; filter:blur(2px); }
    .ghost-block { width:180px; height:90px; margin-bottom:14px; border-radius:15px; border:1px solid #3a3c48; background:#232530; }
    .drawer-backdrop { position:absolute; inset:0; background:rgba(2,3,7,.68); }
    .drawer { position:absolute; inset:0 auto 0 0; width:304px; display:flex; flex-direction:column; padding:20px 16px 16px; background:#0b0c12; border-right:1px solid #282a35; box-shadow:28px 0 70px rgba(0,0,0,.5); }
    .drawer-head { display:flex; align-items:center; justify-content:space-between; }
    .drawer-close { width:34px; height:34px; border:0; background:#171820; border-radius:10px; display:grid; place-items:center; color:#999ba8; }
    .drawer .workspace { margin-top:20px; }
    .drawer .search { margin-top:12px; }
    .drawer .nav-group { margin-top:20px; }
    .drawer .profile-row { margin-top:auto; }

    /* UI kit */
    .kit-artboard { width:1440px; min-height:1160px; padding:52px 58px; background:radial-gradient(circle at 82% 4%,rgba(124,92,255,.08),transparent 340px),#090a0f; }
    .kit-head { display:flex; align-items:flex-end; justify-content:space-between; padding-bottom:28px; border-bottom:1px solid #252731; }
    .kit-head h1 { margin:0; font-size:34px; letter-spacing:-.045em; }
    .kit-head p { margin:8px 0 0; color:#777987; }
    .kit-version { color:#676a78; font-size:11px; }
    .kit-section { margin-top:30px; }
    .kit-section-title { margin-bottom:14px; color:#777987; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:.11em; }
    .foundation-grid { display:grid; grid-template-columns:1.55fr 1.15fr .8fr .8fr; gap:16px; }
    .kit-panel { padding:20px; border:1px solid #262833; border-radius:16px; background:#11121a; }
    .swatches { display:grid; grid-template-columns:repeat(6,1fr); gap:8px; }
    .swatch { height:70px; padding:8px; display:flex; align-items:flex-end; border-radius:10px; border:1px solid rgba(255,255,255,.06); color:#d8d5e2; font-size:7px; }
    .type-sample h2 { margin:0; font-size:28px; letter-spacing:-.04em; }
    .type-sample p { margin:7px 0 0; color:#8d8f9d; font-size:11px; }
    .spacing-row { display:flex; align-items:flex-end; gap:9px; height:66px; }
    .space-bar { width:13px; border-radius:3px 3px 0 0; background:linear-gradient(#8b6cff,#4d3ca0); }
    .radius-row { display:flex; gap:12px; align-items:center; }
    .radius-sample { width:50px; height:50px; border:1px solid #4a4d5c; background:#1b1d28; display:grid; place-items:center; color:#777987; font-size:8px; }
    .kit-components { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
    .component-panel { min-height:144px; padding:17px; border:1px solid #262833; border-radius:16px; background:#11121a; }
    .component-label { margin-bottom:15px; color:#696c79; font-size:8px; font-weight:800; text-transform:uppercase; letter-spacing:.1em; }
    .component-row { display:flex; flex-wrap:wrap; align-items:center; gap:10px; }
    .kit-components .search { width:240px; }
    .kit-components .workspace { width:250px; }
    .kit-components .nav-item { width:210px; }
    .kit-components .profile-row { width:250px; }
    .mini-kpi { width:100%; height:130px; }
    .mini-analytics { width:100%; height:130px; padding:15px; }
    .mini-analytics svg { width:100%; height:64px; margin-top:10px; }
    .kit-plan { width:100%; max-width:350px; }
    .kit-transaction { width:100%; grid-template-columns:1.5fr .7fr .8fr .8fr; }
    .kit-mobile-row { width:100%; max-width:320px; padding:0; border-top:0; }
    .kit-expanded-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
    .kit-pattern-panel { min-height:188px; padding:18px; border:1px solid #262833; border-radius:16px; background:#11121a; }
    .kit-pattern-row { display:flex; flex-wrap:wrap; align-items:center; gap:9px; }
    .kit-pattern-row + .kit-pattern-row { margin-top:12px; }
    .kit-input { width:220px; height:38px; padding:0 11px; border:1px solid #2a2c38; border-radius:10px; color:#dbd8e4; background:#101118; font-size:9px; }
    .kit-select { width:170px; height:38px; display:flex; align-items:center; justify-content:space-between; padding:0 10px; border:1px solid #2a2c38; border-radius:10px; color:#a9aab6; background:#101118; font-size:9px; }
    .kit-table-demo { overflow:hidden; border:1px solid #282a35; border-radius:11px; }
    .kit-table-head,.kit-table-row-demo { display:grid; grid-template-columns:1.2fr .72fr .7fr .6fr; align-items:center; gap:8px; padding:0 11px; }
    .kit-table-head { height:30px; color:#5f6270; background:#0e0f15; font-size:7px; font-weight:800; text-transform:uppercase; letter-spacing:.06em; }
    .kit-table-row-demo { height:42px; border-top:1px solid #242630; color:#a3a5b1; font-size:8px; }
    .kit-table-row-demo.selected { color:#ddd9e8; background:linear-gradient(90deg,rgba(124,92,255,.10),rgba(124,92,255,.02)); box-shadow:inset 2px 0 #7c5cff; }
    .kit-pagination { display:flex; align-items:center; gap:5px; margin-top:11px; }
    .kit-form-example { max-width:280px; }
    .kit-form-example .field-helper { font-size:7px; }
    .kit-info { margin-top:13px; }

    /* Portfolio cover */
    .cover-artboard { width:1440px; height:900px; padding:64px 70px; background:
      radial-gradient(circle at 74% 44%,rgba(124,92,255,.24),transparent 290px),
      radial-gradient(circle at 90% 18%,rgba(65,119,217,.18),transparent 270px),
      radial-gradient(circle at 48% 105%,rgba(124,92,255,.10),transparent 340px),#07080d; }
    .cover-artboard:before { content:""; position:absolute; width:640px; height:1px; right:-110px; top:170px; background:linear-gradient(90deg,transparent,rgba(124,92,255,.45),rgba(92,124,250,.2),transparent); transform:rotate(-24deg); filter:blur(.2px); }
    .cover-artboard:after { content:""; position:absolute; width:420px; height:420px; right:-180px; bottom:-180px; border:1px solid rgba(180,156,255,.16); border-radius:50%; box-shadow:0 0 100px rgba(124,92,255,.08); }
    .cover-top { display:flex; justify-content:space-between; align-items:center; position:relative; z-index:2; }
    .cover-top .app-logo { font-size:19px; }
    .cover-tag { padding:8px 12px; border:1px solid #303341; border-radius:999px; color:#9194a2; font-size:10px; letter-spacing:.04em; }
    .cover-copy { position:relative; z-index:3; width:550px; margin-top:90px; }
    .cover-kicker { color:#9e88ff; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.13em; }
    .cover-copy h1 { margin:17px 0 0; font-size:59px; line-height:1.04; letter-spacing:-.055em; }
    .cover-copy h1 span { background:linear-gradient(90deg,#f6f4ff 20%,#a792ff 90%); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .cover-copy p { width:500px; margin:20px 0 0; color:#999ba9; font-size:16px; line-height:1.7; }
    .cover-meta { display:flex; gap:28px; margin-top:34px; }
    .cover-meta-item { padding-left:13px; border-left:1px solid #363846; }
    .cover-meta-item strong { display:block; font-size:11px; }
    .cover-meta-item span { display:block; margin-top:5px; color:#696c79; font-size:9px; }
    .cover-devices { position:absolute; z-index:2; width:850px; height:650px; right:24px; bottom:-8px; perspective:1200px; }
    .cover-dashboard { position:absolute; width:820px; height:570px; right:0; top:44px; display:grid; grid-template-columns:132px 1fr; grid-template-rows:48px 1fr; overflow:hidden; border:1px solid #373a49; border-radius:20px; background:#0b0c12; box-shadow:0 42px 110px rgba(0,0,0,.62),0 0 65px rgba(124,92,255,.11); transform:rotateY(-6deg) rotateX(2deg) rotateZ(-1deg); transform-origin:center; }
    .cover-mini-side { grid-row:1 / span 2; padding:18px 12px; border-right:1px solid #22242e; background:#0a0b10; }
    .cover-mini-logo { width:25px; height:25px; border-radius:8px; background:linear-gradient(145deg,#9a7aff,#5f43e9); box-shadow:0 0 17px rgba(124,92,255,.4); }
    .cover-mini-nav { margin-top:34px; display:grid; gap:9px; }
    .cover-mini-nav i { display:block; height:24px; border-radius:7px; background:#11121a; }
    .cover-mini-nav i:first-child { background:linear-gradient(90deg,rgba(124,92,255,.18),rgba(124,92,255,.04)); border:1px solid rgba(124,92,255,.16); }
    .cover-mini-top { border-bottom:1px solid #22242e; background:#0c0d13; }
    .cover-mini-main { padding:18px; background:radial-gradient(circle at 90% 0,rgba(124,92,255,.08),transparent 240px),#0b0c11; }
    .cover-mini-title { width:130px; height:14px; border-radius:4px; background:#e9e6f2; opacity:.85; }
    .cover-mini-kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-top:17px; }
    .cover-mini-kpi { height:74px; border:1px solid #292b36; border-radius:12px; background:#12131b; padding:12px; }
    .cover-mini-kpi:first-child { border-color:rgba(124,92,255,.4); box-shadow:0 0 22px rgba(124,92,255,.08); }
    .cover-mini-kpi:before { content:""; display:block; width:55%; height:6px; border-radius:4px; background:#656875; opacity:.5; }
    .cover-mini-kpi:after { content:""; display:block; width:72%; height:14px; border-radius:4px; background:#e9e6f2; opacity:.85; margin-top:12px; }
    .cover-mini-grid { display:grid; grid-template-columns:2fr 1fr; gap:10px; margin-top:10px; }
    .cover-mini-card { height:200px; border:1px solid #292b36; border-radius:12px; background:#11121a; padding:14px; }
    .cover-chart-line { width:100%; height:120px; margin-top:24px; }
    .cover-mini-lower { display:grid; grid-template-columns:1fr 2fr; gap:10px; margin-top:10px; }
    .cover-mini-lower .cover-mini-card { height:150px; }
    .cover-phone { position:absolute; width:186px; height:392px; right:635px; bottom:0; padding:8px; border:1px solid #464959; border-radius:26px; background:#0a0b10; box-shadow:0 32px 70px rgba(0,0,0,.66),0 0 30px rgba(92,124,250,.10); transform:rotateZ(2deg); }
    .cover-phone-inner { height:100%; overflow:hidden; border-radius:20px; padding:15px 10px; background:radial-gradient(circle at 90% 0,rgba(124,92,255,.13),transparent 160px),#0b0c12; }
    .phone-pill { width:56px; height:5px; margin:0 auto 18px; border-radius:10px; background:#282a35; }
    .phone-title { width:72px; height:10px; border-radius:3px; background:#ece9f4; }
    .phone-kpis { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:14px; }
    .phone-kpis i { height:56px; border:1px solid #292b36; border-radius:9px; background:#13141c; }
    .phone-kpis i:first-child { border-color:rgba(124,92,255,.38); }
    .phone-card-mini { height:124px; margin-top:7px; border:1px solid #292b36; border-radius:10px; background:#11121a; }

    @media (max-width:900px) {
      .prototype-nav { height:auto; min-height:68px; padding:12px 14px; flex-wrap:wrap; gap:10px; }
      .prototype-brand { min-width:0; }
      .prototype-brand span:last-child,.prototype-note { display:none; }
      .tabs { width:100%; order:2; }
      .stage { padding:18px; }
      .cover-artboard,.desktop-artboard,.kit-artboard { transform-origin:top left; }
    }
  </style>
</head>
<body>
  <svg width="0" height="0" aria-hidden="true" style="position:absolute">
    <symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></symbol>
    <symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19H2"/></symbol>
    <symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
    <symbol id="i-card" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></symbol>
    <symbol id="i-settings" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.83 2.83-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21h-4v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06-2.83-2.83.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3v-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06 2.83-2.83.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3h4v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06 2.83 2.83-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21v4h-.09A1.65 1.65 0 0 0 19.4 15z"/></symbol>
    <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></symbol>
    <symbol id="i-chevron" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></symbol>
    <symbol id="i-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
    <symbol id="i-bell" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></symbol>
    <symbol id="i-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.2 9a3 3 0 1 1 4.4 2.65c-.95.5-1.6 1.1-1.6 2.35"/><path d="M12 18h.01"/></symbol>
    <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></symbol>
    <symbol id="i-filter" viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></symbol>
    <symbol id="i-export" viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 14v6h14v-6"/></symbol>
    <symbol id="i-dollar" viewBox="0 0 24 24"><path d="M12 2v20M17 5.5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></symbol>
    <symbol id="i-repeat" viewBox="0 0 24 24"><path d="m17 1 4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 23-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></symbol>
    <symbol id="i-percent" viewBox="0 0 24 24"><path d="m19 5-14 14"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></symbol>
    <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol>
  </svg>

  <header class="prototype-nav">
    <div class="prototype-brand"><span class="brand-mark">S</span><strong>Subtera</strong><span>Visual prototype</span></div>
    <nav class="tabs" aria-label="Prototype views">
      <button class="tab active" data-view="cover">Portfolio Cover</button>
      <button class="tab" data-view="desktop">Overview Desktop</button>
      <button class="tab" data-view="analytics">Analytics Desktop</button>
      <button class="tab" data-view="customers">Customers Desktop</button>
      <button class="tab" data-view="subscriptions">Subscriptions Desktop</button>
      <button class="tab" data-view="settings">Settings Desktop</button>
      <button class="tab" data-view="mobile">Overview Mobile</button>
      <button class="tab" data-view="drawer">Mobile Drawer</button>
      <button class="tab" data-view="kit">Mini UI Kit</button>
    </nav>
    <div class="prototype-note">Static design concept · no production logic</div>
  </header>

  <main>
    <section class="view active" id="view-cover">
      <div class="stage center">
        <article class="artboard cover-artboard" aria-label="Subtera portfolio cover concept">
          <div class="cover-top">
            <div class="app-logo"><span class="brand-mark">S</span><span>Subtera</span></div>
            <div class="cover-tag">UI/UX · Responsive SaaS · 2026</div>
          </div>
          <div class="cover-copy">
            <div class="cover-kicker">Subscription intelligence, clarified</div>
            <h1><span>Subscription Analytics Dashboard</span></h1>
            <p>Responsive SaaS UI/UX Design and Figma-to-Next.js Concept</p>
            <div class="cover-meta">
              <div class="cover-meta-item"><strong>Desktop</strong><span>1440 px overview</span></div>
              <div class="cover-meta-item"><strong>Mobile</strong><span>390 px adaptation</span></div>
              <div class="cover-meta-item"><strong>System</strong><span>Focused UI kit</span></div>
            </div>
          </div>
          <div class="cover-devices" aria-hidden="true">
            <div class="cover-dashboard">
              <div class="cover-mini-side"><div class="cover-mini-logo"></div><div class="cover-mini-nav"><i></i><i></i><i></i><i></i><i></i></div></div>
              <div class="cover-mini-top"></div>
              <div class="cover-mini-main">
                <div class="cover-mini-title"></div>
                <div class="cover-mini-kpis"><div class="cover-mini-kpi"></div><div class="cover-mini-kpi"></div><div class="cover-mini-kpi"></div><div class="cover-mini-kpi"></div></div>
                <div class="cover-mini-grid">
                  <div class="cover-mini-card"><svg class="cover-chart-line" viewBox="0 0 500 120"><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c5cff" stop-opacity=".28"/><stop offset="1" stop-color="#7c5cff" stop-opacity="0"/></linearGradient></defs><path d="M10 104 C80 91 110 82 155 78 S235 60 280 58 S365 32 410 28 S465 20 490 14 L490 112 L10 112Z" fill="url(#cg)"/><path d="M10 104 C80 91 110 82 155 78 S235 60 280 58 S365 32 410 28 S465 20 490 14" fill="none" stroke="#8b6cff" stroke-width="2"/></svg></div>
                  <div class="cover-mini-card"><div class="donut" style="width:110px;height:110px;margin:28px auto 0"><div class="donut-center"><strong style="font-size:15px">2,846</strong><span>ACTIVE</span></div></div></div>
                </div>
                <div class="cover-mini-lower"><div class="cover-mini-card"></div><div class="cover-mini-card"></div></div>
              </div>
            </div>
            <div class="cover-phone"><div class="cover-phone-inner"><div class="phone-pill"></div><div class="phone-title"></div><div class="phone-kpis"><i></i><i></i><i></i><i></i></div><div class="phone-card-mini"></div><div class="phone-card-mini" style="height:80px"></div></div></div>
          </div>
        </article>
      </div>
    </section>

    <section class="view" id="view-desktop">
      <div class="stage center">
        <article class="artboard desktop-artboard" aria-label="Subtera overview desktop dashboard">
          <aside class="sidebar">
            <div class="app-logo"><span class="brand-mark">S</span><span>Subtera</span></div>
            <div class="workspace"><div class="workspace-logo"><svg class="icon"><use href="#i-grid"/></svg></div><div class="workspace-copy"><div class="eyebrow">Workspace</div><div class="workspace-name">Acme Cloud</div></div><svg class="icon sm"><use href="#i-down"/></svg></div>
            <div class="search"><svg class="icon sm"><use href="#i-search"/></svg><span>Search</span><span class="shortcut">⌘ K</span></div>
            <div class="nav-label">Workspace</div>
            <nav class="nav-group">
              <div class="nav-item active"><svg class="icon"><use href="#i-grid"/></svg><span>Overview</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-chart"/></svg><span>Analytics</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-users"/></svg><span>Customers</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-card"/></svg><span>Subscriptions</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-settings"/></svg><span>Settings</span></div>
            </nav>
            <div class="sidebar-bottom"><div class="profile-row"><div class="avatar">MC</div><div class="profile-copy"><div class="profile-name">Maya Chen</div><div class="profile-role">Workspace Admin</div></div><svg class="icon sm"><use href="#i-chevron"/></svg></div></div>
          </aside>

          <header class="topbar">
            <div class="breadcrumb"><strong>Dashboard</strong><span class="crumb-sep">/</span><span>Overview</span></div>
            <div class="top-actions"><div class="icon-btn"><svg class="icon"><use href="#i-help"/></svg></div><div class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><i class="notify-dot"></i></div><div class="top-profile"><div class="avatar">MC</div><svg class="icon sm"><use href="#i-down"/></svg></div></div>
          </header>

          <section class="main-content">
            <div class="page-heading"><div><h1>Overview</h1><p>Monitor recurring revenue, subscriptions and customer activity.</p></div><div class="heading-actions"><button class="app-btn date-btn"><span><svg class="icon sm" style="display:inline-block;vertical-align:-3px;margin-right:7px"><use href="#i-calendar"/></svg>Jun 15 – Jul 14, 2026</span><svg class="icon sm"><use href="#i-down"/></svg></button><button class="app-btn ghost"><svg class="icon sm"><use href="#i-filter"/></svg>Filters</button><button class="app-btn"><svg class="icon sm"><use href="#i-export"/></svg>Export</button></div></div>

            <div class="kpi-grid">
              <article class="card kpi highlight"><div class="kpi-top"><span class="kpi-label">Monthly Recurring Revenue</span><span class="metric-icon"><svg class="icon"><use href="#i-dollar"/></svg></span></div><div class="kpi-value">$84,720</div><div class="kpi-foot"><span class="trend positive">↗ 8.4%</span><span class="kpi-note">+$6,580 net increase</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C14 22 16 19 25 20 S38 11 47 14 S62 8 78 4" fill="none" stroke="#8b6cff" stroke-width="2"/><path d="M2 25 C14 22 16 19 25 20 S38 11 47 14 S62 8 78 4 L78 30 L2 30Z" fill="rgba(124,92,255,.10)"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Annual Recurring Revenue</span><span class="metric-icon"><svg class="icon"><use href="#i-repeat"/></svg></span></div><div class="kpi-value">$1,016,640</div><div class="kpi-foot"><span class="trend positive">↗ 8.4%</span><span class="kpi-note">+$78,960 annualized</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C14 22 16 19 25 20 S38 11 47 14 S62 8 78 4" fill="none" stroke="#8d82b8" stroke-width="1.7"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Active Subscriptions</span><span class="metric-icon"><svg class="icon"><use href="#i-users"/></svg></span></div><div class="kpi-value">2,846</div><div class="kpi-foot"><span class="trend positive">↗ 5.2%</span><span class="kpi-note">+141 net subscriptions</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C12 23 18 17 27 19 S42 14 51 12 S67 9 78 5" fill="none" stroke="#737992" stroke-width="1.7"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Churn Rate</span><span class="metric-icon"><svg class="icon"><use href="#i-percent"/></svg></span></div><div class="kpi-value">3.84%</div><div class="kpi-foot"><span class="trend improve">↓ 0.43 pp</span><span class="kpi-note">104 subscriptions churned</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 5 C14 9 20 7 28 12 S43 15 52 18 S66 22 78 25" fill="none" stroke="#5a776d" stroke-width="1.7"/></svg></article>
            </div>

            <div class="analytics-row">
              <article class="card analytics-card">
                <div class="card-header"><div><div class="card-title">Revenue Overview</div><div class="card-subtitle">Gross revenue for the selected period</div></div><div class="segment"><span class="active">Revenue</span><span>MRR</span></div></div>
                <div class="revenue-total"><strong>$112,480</strong><span class="trend positive">↗ 9.6%</span><span>vs $102,630 previous period</span></div>
                <div class="chart-wrap">
                  <svg viewBox="0 0 800 250" role="img" aria-label="Cumulative gross revenue, current period compared with previous period">
                    <defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c5cff" stop-opacity=".26"/><stop offset="1" stop-color="#7c5cff" stop-opacity="0"/></linearGradient></defs>
                    <g><line class="chart-grid" x1="62" y1="28" x2="770" y2="28"/><line class="chart-grid" x1="62" y1="76" x2="770" y2="76"/><line class="chart-grid" x1="62" y1="124" x2="770" y2="124"/><line class="chart-grid" x1="62" y1="172" x2="770" y2="172"/><line class="chart-grid" x1="62" y1="220" x2="770" y2="220"/></g>
                    <g class="chart-label"><text x="10" y="31">$120k</text><text x="17" y="79">$90k</text><text x="17" y="127">$60k</text><text x="17" y="175">$30k</text><text x="34" y="223">$0</text><text x="62" y="242">Jun 15</text><text x="225" y="242">Jun 22</text><text x="395" y="242">Jun 29</text><text x="570" y="242">Jul 6</text><text x="730" y="242">Jul 14</text></g>
                    <path d="M64 182 C120 174 180 154 235 140 S350 111 406 95 S520 62 577 50 S690 44 748 42 L748 220 L64 220Z" fill="url(#revenueFill)"/>
                    <path class="chart-previous" d="M64 185 C130 178 178 159 235 146 S348 119 406 105 S520 78 577 65 S687 61 748 58"/>
                    <path class="chart-current" d="M64 182 C120 174 180 154 235 140 S350 111 406 95 S520 62 577 50 S690 44 748 42"/>
                    <line class="focus-line" x1="577" y1="42" x2="577" y2="220"/>
                    <circle cx="577" cy="50" r="8" fill="rgba(124,92,255,.2)"/><circle cx="577" cy="50" r="4" fill="#9b82ff" stroke="#d2c7ff" stroke-width="1.5"/>
                    <g transform="translate(454 72)"><rect class="tooltip-box" width="196" height="86" rx="10"/><text class="tooltip-title" x="13" y="19">JUL 6 – JUL 12</text><circle cx="15" cy="38" r="3" fill="#8b6cff"/><text class="tooltip-copy" x="24" y="41">Current period</text><text class="tooltip-copy" x="181" y="41" text-anchor="end">$107,220</text><circle cx="15" cy="57" r="3" fill="#5a5f73"/><text class="tooltip-title" x="24" y="60">Previous period</text><text class="tooltip-title" x="181" y="60" text-anchor="end">$97,970</text><text class="tooltip-good" x="13" y="76">+9.4% period change</text></g>
                  </svg>
                </div>
              </article>

              <article class="card analytics-card">
                <div class="card-header"><div><div class="card-title">Customer Growth</div><div class="card-subtitle">New paid subscriptions and churn</div></div><span class="trend positive">↗ 9.8%</span></div>
                <div class="customer-top"><strong>3,214</strong><span style="color:#6f7280;font-size:9px;margin-bottom:5px">total customer accounts</span></div>
                <div class="customer-chart"><svg viewBox="0 0 330 170" role="img" aria-label="Weekly new subscriptions and churned subscriptions"><g><line class="chart-grid" x1="18" y1="28" x2="318" y2="28"/><line class="chart-grid" x1="18" y1="78" x2="318" y2="78"/><line class="chart-grid" x1="18" y1="128" x2="318" y2="128"/></g><path d="M28 76 C68 73 91 66 113 64 S180 60 198 57 S273 35 310 28" fill="none" stroke="#8b6cff" stroke-width="2.2"/><path d="M28 124 C67 123 92 113 113 112 S174 119 198 121 S273 115 310 114" fill="none" stroke="#ff7a90" stroke-width="1.8"/><g fill="#8b6cff"><circle cx="28" cy="76" r="3"/><circle cx="113" cy="64" r="3"/><circle cx="198" cy="57" r="3"/><circle cx="310" cy="28" r="3"/></g><g class="chart-label"><text x="20" y="151">Jun 15</text><text x="102" y="151">Jun 22</text><text x="187" y="151">Jun 29</text><text x="286" y="151">Jul 6</text></g></svg></div>
                <div class="legend"><span><i style="background:#8b6cff"></i>New subscriptions</span><span><i style="background:#ff7a90"></i>Churned</span></div>
                <div class="customer-summary"><div class="summary-item"><span>New</span><strong>245</strong></div><div class="summary-item"><span>Churned</span><strong>104</strong></div><div class="summary-item"><span>Net growth</span><strong style="color:#67dda9">+141</strong></div></div>
              </article>
            </div>

            <div class="analytics-row lower">
              <article class="card analytics-card">
                <div class="card-header"><div><div class="card-title">Subscriptions by Plan</div><div class="card-subtitle">Active subscriptions and monthly value</div></div><button class="app-btn ghost" style="min-height:32px;padding:0 10px">View details</button></div>
                <div class="plans-body"><div class="donut"><div class="donut-center"><strong>2,846</strong><span>ACTIVE</span></div></div><div class="plan-list">
                  <div class="plan-row"><div><div class="plan-name"><i class="plan-dot" style="background:#7c5cff"></i>Starter <span class="plan-meta">· $15</span></div><div class="plan-meta">1,326 · 46.6%</div></div><div class="plan-value">$19,890<small>MRR</small></div></div>
                  <div class="plan-row"><div><div class="plan-name"><i class="plan-dot" style="background:#a58fff"></i>Growth <span class="plan-meta">· $29</span></div><div class="plan-meta">900 · 31.6%</div></div><div class="plan-value">$26,100<small>MRR</small></div></div>
                  <div class="plan-row"><div><div class="plan-name"><i class="plan-dot" style="background:#5c6fba"></i>Pro <span class="plan-meta">· $49</span></div><div class="plan-meta">453 · 15.9%</div></div><div class="plan-value">$22,197<small>MRR</small></div></div>
                  <div class="plan-row"><div><div class="plan-name"><i class="plan-dot" style="background:#3a3e50"></i>Teams <span class="plan-meta">· $99</span></div><div class="plan-meta">167 · 5.9%</div></div><div class="plan-value">$16,533<small>MRR</small></div></div>
                </div></div>
              </article>

              <article class="card analytics-card">
                <div class="card-header"><div><div class="card-title">Recent Transactions</div><div class="card-subtitle">Latest subscription payments</div></div><button class="app-btn ghost" style="min-height:32px;padding:0 10px">View all</button></div>
                <div class="transaction-table"><div class="transaction-head"><span>Customer</span><span>Plan</span><span>Date</span><span>Payment</span><span style="text-align:right">Amount</span><span>Status</span></div>
                  <div class="transaction-row"><div class="customer-cell"><div class="avatar">OC</div><span>Olivia Chen</span></div><span>Growth</span><span>Jul 14, 10:42</span><span>Visa •4242</span><span class="amount">$29.00</span><span><i class="status paid">Paid</i></span></div>
                  <div class="transaction-row"><div class="customer-cell"><div class="avatar">NL</div><span>Northstar Labs</span></div><span>Teams</span><span>Jul 14, 09:18</span><span>Mastercard •1088</span><span class="amount">$99.00</span><span><i class="status paid">Paid</i></span></div>
                  <div class="transaction-row"><div class="customer-cell"><div class="avatar">MR</div><span>Marco Ruiz</span></div><span>Starter</span><span>Jul 13, 17:05</span><span>Visa •9031</span><span class="amount">$15.00</span><span><i class="status refunded">Refunded</i></span></div>
                  <div class="transaction-row"><div class="customer-cell"><div class="avatar">AT</div><span>Ava Thompson</span></div><span>Pro</span><span>Jul 13, 14:22</span><span>Amex •0005</span><span class="amount">$49.00</span><span><i class="status pending">Pending</i></span></div>
                  <div class="transaction-row"><div class="customer-cell"><div class="avatar">KS</div><span>Koto Studio</span></div><span>Teams</span><span>Jul 12, 16:41</span><span>Visa •3320</span><span class="amount">$99.00</span><span><i class="status failed">Failed</i></span></div>
                </div>
              </article>
            </div>
          </section>
        </article>
      </div>
    </section>

    <section class="view" id="view-analytics">
      <div class="stage center">
        <article class="artboard desktop-artboard analytics-page" aria-label="Subtera analytics desktop dashboard">
          <aside class="sidebar">
            <div class="app-logo"><span class="brand-mark">S</span><span>Subtera</span></div>
            <div class="workspace"><div class="workspace-logo"><svg class="icon"><use href="#i-grid"/></svg></div><div class="workspace-copy"><div class="eyebrow">Workspace</div><div class="workspace-name">Acme Cloud</div></div><svg class="icon sm"><use href="#i-down"/></svg></div>
            <div class="search"><svg class="icon sm"><use href="#i-search"/></svg><span>Search</span><span class="shortcut">⌘ K</span></div>
            <div class="nav-label">Workspace</div>
            <nav class="nav-group">
              <div class="nav-item"><svg class="icon"><use href="#i-grid"/></svg><span>Overview</span></div>
              <div class="nav-item active"><svg class="icon"><use href="#i-chart"/></svg><span>Analytics</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-users"/></svg><span>Customers</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-card"/></svg><span>Subscriptions</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-settings"/></svg><span>Settings</span></div>
            </nav>
            <div class="sidebar-bottom"><div class="profile-row"><div class="avatar">MC</div><div class="profile-copy"><div class="profile-name">Maya Chen</div><div class="profile-role">Workspace Admin</div></div><svg class="icon sm"><use href="#i-chevron"/></svg></div></div>
          </aside>

          <header class="topbar">
            <div class="breadcrumb"><strong>Dashboard</strong><span class="crumb-sep">/</span><span>Analytics</span></div>
            <div class="top-actions"><div class="icon-btn"><svg class="icon"><use href="#i-help"/></svg></div><div class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><i class="notify-dot"></i></div><div class="top-profile"><div class="avatar">MC</div><svg class="icon sm"><use href="#i-down"/></svg></div></div>
          </header>

          <section class="main-content">
            <div class="page-heading"><div><h1>Analytics</h1><p>Explore revenue, subscription growth and customer retention trends.</p></div><div class="heading-actions"><button class="app-btn date-btn"><span><svg class="icon sm" style="display:inline-block;vertical-align:-3px;margin-right:7px"><use href="#i-calendar"/></svg>Jun 15 – Jul 14, 2026</span><svg class="icon sm"><use href="#i-down"/></svg></button><button class="app-btn ghost compare-btn"><svg class="icon sm"><use href="#i-repeat"/></svg>Compare to previous period</button><button class="app-btn ghost"><svg class="icon sm"><use href="#i-filter"/></svg>Filters</button><button class="app-btn"><svg class="icon sm"><use href="#i-export"/></svg>Export report</button></div></div>

            <div class="kpi-grid">
              <article class="card kpi highlight"><div class="kpi-top"><span class="kpi-label">MRR Growth</span><span class="metric-icon"><svg class="icon"><use href="#i-chart"/></svg></span></div><div class="kpi-value">+8.4%</div><div class="kpi-foot"><span class="trend positive">vs +6.1%</span><span class="kpi-note">+$6,580 net MRR increase</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C12 22 18 23 27 18 S42 16 50 11 S66 10 78 4" fill="none" stroke="#8b6cff" stroke-width="2"/><path d="M2 25 C12 22 18 23 27 18 S42 16 50 11 S66 10 78 4 L78 30 L2 30Z" fill="rgba(124,92,255,.10)"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Average Revenue per Account</span><span class="metric-icon"><svg class="icon"><use href="#i-dollar"/></svg></span></div><div class="kpi-value">$29.77</div><div class="kpi-foot"><span class="trend positive">↗ 2.1%</span><span class="kpi-note">$84,720 / 2,846 active</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 23 C14 21 20 16 28 18 S44 13 53 14 S66 8 78 7" fill="none" stroke="#8178a7" stroke-width="1.7"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Net Subscription Growth</span><span class="metric-icon"><svg class="icon"><use href="#i-repeat"/></svg></span></div><div class="kpi-value">+141</div><div class="kpi-foot"><span class="trend positive">245 new</span><span class="kpi-note">104 churned subscriptions</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C12 24 20 19 28 20 S43 15 52 13 S67 9 78 4" fill="none" stroke="#737992" stroke-width="1.7"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Churn Rate</span><span class="metric-icon"><svg class="icon"><use href="#i-percent"/></svg></span></div><div class="kpi-value">3.84%</div><div class="kpi-foot"><span class="trend improve">↓ 0.43 pp</span><span class="kpi-note">Previous period 4.27%</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 5 C14 8 19 7 28 12 S44 15 53 18 S67 22 78 25" fill="none" stroke="#5a776d" stroke-width="1.7"/></svg></article>
            </div>

            <div class="analytics-row">
              <article class="card analytics-card">
                <div class="card-header"><div><div class="card-title">Revenue and MRR Trends</div><div class="card-subtitle">Current performance compared with the previous period</div></div><div class="segment"><span class="active">Revenue</span><span>MRR</span></div></div>
                <div class="analysis-metric-strip">
                  <div class="analysis-metric"><div class="analysis-metric-label"><span>Gross revenue</span><span class="trend positive" style="padding:3px 6px">↗ 9.6%</span></div><div class="analysis-metric-value"><strong>$112,480</strong><span>Previous $102,630</span></div></div>
                  <div class="analysis-metric"><div class="analysis-metric-label"><span>Monthly recurring revenue</span><span class="trend positive" style="padding:3px 6px">↗ 8.4%</span></div><div class="analysis-metric-value"><strong>$84,720</strong><span>Previous $78,140</span></div></div>
                </div>
                <div class="analysis-chart"><svg viewBox="0 0 800 220" role="img" aria-label="Gross revenue current and previous period trend">
                  <defs><linearGradient id="analyticsRevenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c5cff" stop-opacity=".23"/><stop offset="1" stop-color="#7c5cff" stop-opacity="0"/></linearGradient></defs>
                  <g><line class="chart-grid" x1="60" y1="22" x2="772" y2="22"/><line class="chart-grid" x1="60" y1="64" x2="772" y2="64"/><line class="chart-grid" x1="60" y1="106" x2="772" y2="106"/><line class="chart-grid" x1="60" y1="148" x2="772" y2="148"/><line class="chart-grid" x1="60" y1="190" x2="772" y2="190"/></g>
                  <g class="chart-label"><text x="8" y="25">$120k</text><text x="15" y="67">$90k</text><text x="15" y="109">$60k</text><text x="15" y="151">$30k</text><text x="32" y="193">$0</text><text x="60" y="212">Jun 15</text><text x="195" y="212">Jun 22</text><text x="333" y="212">Jun 29</text><text x="476" y="212">Jul 6</text><text x="611" y="212">Jul 12</text><text x="738" y="212">Jul 14</text></g>
                  <path d="M62 157 C120 149 160 137 201 120 S292 99 342 80 S433 58 487 43 S585 30 628 27 S710 24 748 23 L748 190 L62 190Z" fill="url(#analyticsRevenueFill)"/>
                  <path class="chart-previous" d="M62 161 C120 155 160 143 201 128 S290 110 342 91 S433 71 487 56 S582 43 628 39 S711 34 748 33"/>
                  <path class="chart-current" d="M62 157 C120 149 160 137 201 120 S292 99 342 80 S433 58 487 43 S585 30 628 27 S710 24 748 23"/>
                  <line class="focus-line" x1="487" y1="36" x2="487" y2="190"/><circle cx="487" cy="43" r="8" fill="rgba(124,92,255,.18)"/><circle cx="487" cy="43" r="4" fill="#9b82ff" stroke="#d2c7ff" stroke-width="1.5"/>
                  <g transform="translate(505 53)"><rect class="tooltip-box" width="188" height="85" rx="10"/><text class="tooltip-title" x="13" y="18">JUL 6 – JUL 12</text><circle cx="15" cy="37" r="3" fill="#8b6cff"/><text class="tooltip-copy" x="24" y="40">Current</text><text class="tooltip-copy" x="173" y="40" text-anchor="end">$107,220</text><circle cx="15" cy="56" r="3" fill="#5a5f73"/><text class="tooltip-title" x="24" y="59">Previous</text><text class="tooltip-title" x="173" y="59" text-anchor="end">$97,970</text><text class="tooltip-good" x="13" y="76">+9.4% difference</text></g>
                </svg></div>
              </article>

              <article class="card analytics-card">
                <div class="card-header"><div><div class="card-title">Subscription Growth</div><div class="card-subtitle">New and churned subscriptions by week</div></div><span class="trend positive">+141 net</span></div>
                <div class="growth-stats"><div class="growth-stat"><span>New</span><strong>245</strong></div><div class="growth-stat"><span>Churned</span><strong style="color:#ff8da0">104</strong></div><div class="growth-stat"><span>Net growth</span><strong style="color:#6fdfac">+141</strong></div></div>
                <div class="growth-chart"><svg viewBox="0 0 330 190" role="img" aria-label="New and churned subscription bars by week"><g><line class="chart-grid" x1="20" y1="28" x2="318" y2="28"/><line class="chart-grid" x1="20" y1="78" x2="318" y2="78"/><line class="chart-grid" x1="20" y1="128" x2="318" y2="128"/></g><g fill="#7c5cff"><rect x="42" y="73" width="20" height="75" rx="5"/><rect x="112" y="66" width="20" height="82" rx="5"/><rect x="182" y="62" width="20" height="86" rx="5"/><rect x="252" y="45" width="20" height="103" rx="5"/></g><g fill="#ff7a90" opacity=".82"><rect x="64" y="114" width="12" height="34" rx="4"/><rect x="134" y="108" width="12" height="40" rx="4"/><rect x="204" y="112" width="12" height="36" rx="4"/><rect x="274" y="110" width="12" height="38" rx="4"/></g><g class="chart-label"><text x="40" y="168">Jun 15</text><text x="108" y="168">Jun 22</text><text x="179" y="168">Jun 29</text><text x="254" y="168">Jul 6</text></g></svg></div>
                <div class="growth-compare"><div class="legend"><span><i style="background:#7c5cff"></i>New</span><span><i style="background:#ff7a90"></i>Churned</span></div><span>Previous net growth <strong style="color:#a8a9b6">+108</strong></span></div>
              </article>
            </div>

            <div class="analytics-row lower">
              <article class="card analytics-card">
                <div class="card-header"><div><div class="card-title">Churn and Retention</div><div class="card-subtitle">Subscription retention quality over time</div></div><span class="trend improve">↓ 0.43 pp</span></div>
                <div class="retention-hero"><div class="retention-rate"><span>Current churn rate</span><strong>3.84%</strong></div><div style="text-align:right"><span style="display:block;color:#696c79;font-size:8px">Previous period</span><strong style="display:block;margin-top:5px;font-size:15px">4.27%</strong></div></div>
                <div class="retention-chart"><svg viewBox="0 0 330 130" role="img" aria-label="Churn rate decreasing compared with previous period"><line class="chart-grid" x1="20" y1="25" x2="318" y2="25"/><line class="chart-grid" x1="20" y1="65" x2="318" y2="65"/><line class="chart-grid" x1="20" y1="105" x2="318" y2="105"/><path d="M24 35 C67 42 88 50 111 54 S172 67 199 72 S272 87 313 94" fill="none" stroke="#3ddc97" stroke-width="2.2"/><path d="M24 25 C68 31 88 36 111 42 S172 51 199 59 S270 70 313 76" fill="none" stroke="#565a68" stroke-width="1.5" stroke-dasharray="5 5"/><circle cx="313" cy="94" r="4" fill="#3ddc97" stroke="#baf5d8" stroke-width="1.2"/></svg></div>
                <div class="retention-details"><div class="retention-detail"><span>Retained subscriptions</span><strong>2,601</strong></div><div class="retention-detail"><span>Net revenue retention</span><strong>108.4%</strong></div></div>
                <div class="positive-note">Lower churn indicates improved retention for this period</div>
              </article>

              <article class="card analytics-card">
                <div class="card-header"><div><div class="card-title">Plan Performance</div><div class="card-subtitle">Subscriber mix, recurring revenue contribution and churn</div></div><button class="app-btn ghost" style="min-height:32px;padding:0 10px"><svg class="icon sm"><use href="#i-export"/></svg>Export data</button></div>
                <div class="plan-performance">
                  <div class="plan-performance-head"><span>Plan</span><span>Price</span><span>Active</span><span>Share</span><span>MRR</span><span>MRR contribution</span><span>Churn</span><span>Trend</span></div>
                  <div class="plan-performance-row"><div class="plan-cell"><i class="plan-dot" style="background:#7c5cff"></i>Starter</div><span>$15</span><span>1,326</span><span>46.6%</span><strong style="color:#e7e4ee">$19,890</strong><div class="contribution"><div class="contribution-track"><div class="contribution-fill" style="width:23.5%"></div></div><span>23.5%</span></div><span>4.5%</span><span class="table-trend">↗ 4.0%</span></div>
                  <div class="plan-performance-row"><div class="plan-cell"><i class="plan-dot" style="background:#a58fff"></i>Growth</div><span>$29</span><span>900</span><span>31.6%</span><strong style="color:#e7e4ee">$26,100</strong><div class="contribution"><div class="contribution-track"><div class="contribution-fill" style="width:30.8%"></div></div><span>30.8%</span></div><span>3.6%</span><span class="table-trend">↗ 7.0%</span></div>
                  <div class="plan-performance-row"><div class="plan-cell"><i class="plan-dot" style="background:#5c6fba"></i>Pro</div><span>$49</span><span>453</span><span>15.9%</span><strong style="color:#e7e4ee">$22,197</strong><div class="contribution"><div class="contribution-track"><div class="contribution-fill" style="width:26.2%"></div></div><span>26.2%</span></div><span>2.9%</span><span class="table-trend">↗ 11.0%</span></div>
                  <div class="plan-performance-row"><div class="plan-cell"><i class="plan-dot" style="background:#3a3e50"></i>Teams</div><span>$99</span><span>167</span><span>5.9%</span><strong style="color:#e7e4ee">$16,533</strong><div class="contribution"><div class="contribution-track"><div class="contribution-fill" style="width:19.5%"></div></div><span>19.5%</span></div><span>2.1%</span><span class="table-trend">↗ 12.0%</span></div>
                  <div class="plan-performance-row total"><div class="plan-cell">Total</div><span>—</span><span>2,846</span><span>100%</span><span>$84,720</span><span>100%</span><span>3.84%</span><span class="table-trend">↗ 8.4%</span></div>
                </div>
              </article>
            </div>
          </section>
        </article>
      </div>
    </section>

    <section class="view" id="view-customers">
      <div class="stage center">
        <article class="artboard desktop-artboard customers-page" aria-label="Subtera customers desktop dashboard">
          <aside class="sidebar">
            <div class="app-logo"><span class="brand-mark">S</span><span>Subtera</span></div>
            <div class="workspace"><div class="workspace-logo"><svg class="icon"><use href="#i-grid"/></svg></div><div class="workspace-copy"><div class="eyebrow">Workspace</div><div class="workspace-name">Acme Cloud</div></div><svg class="icon sm"><use href="#i-down"/></svg></div>
            <div class="search"><svg class="icon sm"><use href="#i-search"/></svg><span>Search</span><span class="shortcut">⌘ K</span></div>
            <div class="nav-label">Workspace</div>
            <nav class="nav-group">
              <div class="nav-item"><svg class="icon"><use href="#i-grid"/></svg><span>Overview</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-chart"/></svg><span>Analytics</span></div>
              <div class="nav-item active"><svg class="icon"><use href="#i-users"/></svg><span>Customers</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-card"/></svg><span>Subscriptions</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-settings"/></svg><span>Settings</span></div>
            </nav>
            <div class="sidebar-bottom"><div class="profile-row"><div class="avatar">MC</div><div class="profile-copy"><div class="profile-name">Maya Chen</div><div class="profile-role">Workspace Admin</div></div><svg class="icon sm"><use href="#i-chevron"/></svg></div></div>
          </aside>

          <header class="topbar">
            <div class="breadcrumb"><strong>Dashboard</strong><span class="crumb-sep">/</span><span>Customers</span></div>
            <div class="top-actions"><div class="icon-btn"><svg class="icon"><use href="#i-help"/></svg></div><div class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><i class="notify-dot"></i></div><div class="top-profile"><div class="avatar">MC</div><svg class="icon sm"><use href="#i-down"/></svg></div></div>
          </header>

          <section class="main-content">
            <div class="page-heading"><div><h1>Customers</h1><p>Manage customer accounts, subscription status and recurring value.</p></div><div class="heading-actions"><label class="search customer-search"><svg class="icon sm"><use href="#i-search"/></svg><input type="search" placeholder="Search customers" aria-label="Search customers"></label><button class="app-btn ghost"><svg class="icon sm"><use href="#i-filter"/></svg>Filters</button><button class="app-btn"><svg class="icon sm"><use href="#i-export"/></svg>Export CSV</button><button class="app-btn primary"><span style="font-size:16px;line-height:1">+</span>Add customer</button></div></div>

            <div class="kpi-grid">
              <article class="card kpi highlight"><div class="kpi-top"><span class="kpi-label">Total Customers</span><span class="metric-icon"><svg class="icon"><use href="#i-users"/></svg></span></div><div class="kpi-value">3,214</div><div class="kpi-foot"><span class="trend positive">↗ 9.8%</span><span class="kpi-note">+288 new accounts</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C13 23 19 18 27 19 S42 13 51 12 S66 7 78 4" fill="none" stroke="#8b6cff" stroke-width="2"/><path d="M2 25 C13 23 19 18 27 19 S42 13 51 12 S66 7 78 4 L78 30 L2 30Z" fill="rgba(124,92,255,.10)"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Active Subscribers</span><span class="metric-icon"><svg class="icon"><use href="#i-repeat"/></svg></span></div><div class="kpi-value">2,846</div><div class="kpi-foot"><span class="trend positive">↗ 5.2%</span><span class="kpi-note">88.6% of customer accounts</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C12 23 18 17 27 19 S42 14 51 12 S67 9 78 5" fill="none" stroke="#7b7896" stroke-width="1.7"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Trial Accounts</span><span class="metric-icon"><svg class="icon"><use href="#i-calendar"/></svg></span></div><div class="kpi-value">214</div><div class="kpi-foot"><span class="trend" style="color:#77bff4;background:#142b3a;border:1px solid #1d3d50">86 ending</span><span class="kpi-note">trials ending this week</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 18 C15 13 19 15 29 10 S42 12 51 8 S65 10 78 5" fill="none" stroke="#587ea0" stroke-width="1.7"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">At-Risk Customers</span><span class="metric-icon"><svg class="icon"><use href="#i-percent"/></svg></span></div><div class="kpi-value">96</div><div class="kpi-foot"><span class="trend improve">12 fewer</span><span class="kpi-note">payment or engagement risk</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 5 C14 9 20 7 28 12 S43 15 52 18 S66 22 78 25" fill="none" stroke="#5a776d" stroke-width="1.7"/></svg></article>
            </div>

            <section class="card customer-segment-card" aria-label="Customer segments">
              <div class="customer-tabs"><span class="customer-tab active">All</span><span class="customer-tab">Active</span><span class="customer-tab">Trial</span><span class="customer-tab">Past due</span><span class="customer-tab">Churned</span></div>
              <div class="risk-filter-chip">At risk: 96 <small>may overlap statuses</small></div>
              <div class="segment-summary"><div class="segment-summary-item"><span>Active</span><strong>2,846</strong></div><div class="segment-summary-item"><span>Trial</span><strong>214</strong></div><div class="segment-summary-item"><span>Past due</span><strong style="color:#efc45c">63</strong></div><div class="segment-summary-item"><span>Churned this period</span><strong>104</strong></div></div>
            </section>

            <section class="card customer-table-card" aria-label="Customer management table">
              <div class="customer-table-toolbar"><div><h2>Customer accounts</h2><p>Subscription status, recurring value and recent activity</p></div><div class="table-view-control"><span>Last updated 2 min ago</span><button class="app-btn ghost" style="min-height:32px;padding:0 10px"><svg class="icon sm"><use href="#i-repeat"/></svg>Refresh</button></div></div>
              <div class="customers-table-head"><span class="sort-label">Customer <b>↑</b></span><span>Company</span><span>Plan</span><span>Monthly Value</span><span>Status</span><span class="sort-label">Last Activity <b>↓</b></span><span>Joined</span><span></span></div>
              <div class="customers-table-row"><div class="customer-identity"><div class="avatar">OC</div><strong>Olivia Chen</strong></div><span class="company-cell">Northstar Studio</span><span class="plan-badge growth">Growth</span><strong class="amount" style="text-align:left">$29</strong><span><i class="status status-active">Active</i></span><span>12 min ago</span><span>May 18, 2026</span><span class="row-action">⋯</span></div>
              <div class="customers-table-row"><div class="customer-identity"><div class="avatar">NW</div><strong>Noah Williams</strong></div><span class="company-cell">BrightLayer</span><span class="plan-badge teams">Teams</span><strong class="amount" style="text-align:left">$99</strong><span><i class="status status-active">Active</i></span><span>34 min ago</span><span>Apr 02, 2026</span><span class="row-action">⋯</span></div>
              <div class="customers-table-row"><div class="customer-identity"><div class="avatar">AT</div><strong>Ava Thompson</strong></div><span class="company-cell">Pixel Harbor</span><span class="plan-badge pro">Pro</span><strong class="amount" style="text-align:left">$49</strong><span><i class="status status-trial">Trial</i></span><span>1 hr ago</span><span>Jul 08, 2026</span><span class="row-action">⋯</span></div>
              <div class="customers-table-row selected"><div class="customer-identity"><div class="avatar">MR</div><strong>Marco Ruiz</strong></div><span class="company-cell">Verde Labs</span><span class="plan-badge starter">Starter</span><strong class="amount" style="text-align:left">$15</strong><span><i class="status status-active">Active</i></span><span>6 hrs ago</span><span>Mar 21, 2026</span><span class="row-action">⋯</span></div>
              <div class="customers-table-row"><div class="customer-identity"><div class="avatar">MP</div><strong>Maya Patel</strong></div><span class="company-cell">Cloudnest</span><span class="plan-badge growth">Growth</span><strong class="amount" style="text-align:left">$29</strong><span><i class="status status-active">Active</i></span><span>Yesterday</span><span>Feb 14, 2026</span><span class="row-action">⋯</span></div>
              <div class="customers-table-row"><div class="customer-identity"><div class="avatar">EB</div><strong>Ethan Brooks</strong></div><span class="company-cell">Fieldnote</span><span class="plan-badge pro">Pro</span><strong class="amount" style="text-align:left">$49</strong><span><i class="status status-due">Past due</i></span><span>2 days ago</span><span>Jan 29, 2026</span><span class="row-action">⋯</span></div>
              <div class="customers-table-row"><div class="customer-identity"><div class="avatar">SN</div><strong>Sophia Nguyen</strong></div><span class="company-cell">Orbitstack</span><span class="plan-badge teams">Teams</span><strong class="amount" style="text-align:left">$99</strong><span><i class="status status-active">Active</i></span><span>3 days ago</span><span>Dec 11, 2025</span><span class="row-action">⋯</span></div>
              <div class="customers-table-row"><div class="customer-identity"><div class="avatar">LC</div><strong>Liam Carter</strong></div><span class="company-cell">Linear Forge</span><span class="plan-badge starter">Starter</span><strong class="amount" style="text-align:left">$15</strong><span><i class="status status-churned">Churned</i></span><span>8 days ago</span><span>Nov 06, 2025</span><span class="row-action">⋯</span></div>
              <div class="table-footer"><span>Showing 1–8 of 3,214 customers</span><div class="rows-select"><span>Rows per page</span><span>8 <svg class="icon sm"><use href="#i-down"/></svg></span></div><div class="pagination"><span class="page-btn">‹</span><span class="page-btn active">1</span><span class="page-btn">2</span><span class="page-btn">3</span><span class="page-ellipsis">…</span><span class="page-btn">402</span><span class="page-btn">›</span></div></div>
            </section>
          </section>
        </article>
      </div>
    </section>

    <section class="view" id="view-subscriptions">
      <div class="stage center">
        <article class="artboard desktop-artboard subscriptions-page" aria-label="Subtera subscriptions desktop dashboard">
          <aside class="sidebar">
            <div class="app-logo"><span class="brand-mark">S</span><span>Subtera</span></div>
            <div class="workspace"><div class="workspace-logo"><svg class="icon"><use href="#i-grid"/></svg></div><div class="workspace-copy"><div class="eyebrow">Workspace</div><div class="workspace-name">Acme Cloud</div></div><svg class="icon sm"><use href="#i-down"/></svg></div>
            <div class="search"><svg class="icon sm"><use href="#i-search"/></svg><span>Search</span><span class="shortcut">⌘ K</span></div>
            <div class="nav-label">Workspace</div>
            <nav class="nav-group">
              <div class="nav-item"><svg class="icon"><use href="#i-grid"/></svg><span>Overview</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-chart"/></svg><span>Analytics</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-users"/></svg><span>Customers</span></div>
              <div class="nav-item active"><svg class="icon"><use href="#i-card"/></svg><span>Subscriptions</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-settings"/></svg><span>Settings</span></div>
            </nav>
            <div class="sidebar-bottom"><div class="profile-row"><div class="avatar">MC</div><div class="profile-copy"><div class="profile-name">Maya Chen</div><div class="profile-role">Workspace Admin</div></div><svg class="icon sm"><use href="#i-chevron"/></svg></div></div>
          </aside>

          <header class="topbar">
            <div class="breadcrumb"><strong>Dashboard</strong><span class="crumb-sep">/</span><span>Subscriptions</span></div>
            <div class="top-actions"><div class="icon-btn"><svg class="icon"><use href="#i-help"/></svg></div><div class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><i class="notify-dot"></i></div><div class="top-profile"><div class="avatar">MC</div><svg class="icon sm"><use href="#i-down"/></svg></div></div>
          </header>

          <section class="main-content">
            <div class="page-heading"><div><h1>Subscriptions</h1><p>Monitor active plans, billing status and recurring subscription value.</p></div><div class="heading-actions"><button class="app-btn date-btn"><span><svg class="icon sm" style="display:inline-block;vertical-align:-3px;margin-right:7px"><use href="#i-calendar"/></svg>Jun 15 – Jul 14, 2026</span><svg class="icon sm"><use href="#i-down"/></svg></button><button class="app-btn ghost"><svg class="icon sm"><use href="#i-filter"/></svg>Filters</button><button class="app-btn"><svg class="icon sm"><use href="#i-export"/></svg>Export</button><button class="app-btn primary"><span style="font-size:16px;line-height:1">+</span>Add subscription</button></div></div>

            <div class="kpi-grid">
              <article class="card kpi highlight"><div class="kpi-top"><span class="kpi-label">Active Subscriptions</span><span class="metric-icon"><svg class="icon"><use href="#i-repeat"/></svg></span></div><div class="kpi-value">2,846</div><div class="kpi-foot"><span class="trend positive">↗ 5.2%</span><span class="kpi-note">+141 net subscriptions</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C12 23 18 17 27 19 S42 14 51 12 S67 9 78 5" fill="none" stroke="#8b6cff" stroke-width="2"/><path d="M2 25 C12 23 18 17 27 19 S42 14 51 12 S67 9 78 5 L78 30 L2 30Z" fill="rgba(124,92,255,.10)"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Monthly Recurring Revenue</span><span class="metric-icon"><svg class="icon"><use href="#i-dollar"/></svg></span></div><div class="kpi-value">$84,720</div><div class="kpi-foot"><span class="trend positive">↗ 8.4%</span><span class="kpi-note">+$6,580 net increase</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C14 22 16 19 25 20 S38 11 47 14 S62 8 78 4" fill="none" stroke="#8178a7" stroke-width="1.7"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Trialing</span><span class="metric-icon"><svg class="icon"><use href="#i-calendar"/></svg></span></div><div class="kpi-value">214</div><div class="kpi-foot"><span class="trend" style="color:#77bff4;background:#142b3a;border:1px solid #1d3d50">86 ending</span><span class="kpi-note">trials ending this week</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 18 C15 13 19 15 29 10 S42 12 51 8 S65 10 78 5" fill="none" stroke="#587ea0" stroke-width="1.7"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Churn Rate</span><span class="metric-icon"><svg class="icon"><use href="#i-percent"/></svg></span></div><div class="kpi-value">3.84%</div><div class="kpi-foot"><span class="trend improve">↓ 0.43 pp</span><span class="kpi-note">104 churned subscriptions</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 5 C14 9 20 7 28 12 S43 15 52 18 S66 22 78 25" fill="none" stroke="#5a776d" stroke-width="1.7"/></svg></article>
            </div>

            <div class="subscriptions-performance-row">
              <article class="card subscription-plan-card">
                <div class="card-header"><div><div class="card-title">Plan Performance</div><div class="card-subtitle">2,846 active · $84,720 MRR · 100% subscriber share</div></div><button class="app-btn ghost" style="min-height:32px;padding:0 10px">Manage plans</button></div>
                <div class="subscription-plan-table"><div class="subscription-plan-head"><span>Plan</span><span>Price</span><span>Active</span><span>Share</span><span>MRR</span><span>Churn</span><span>Trend</span></div>
                  <div class="subscription-plan-row"><div class="plan-cell"><i class="plan-dot" style="background:#7c5cff"></i>Starter</div><span>$15</span><span>1,326</span><span>46.6%</span><strong style="color:#e7e4ee">$19,890</strong><span>4.5%</span><span class="table-trend">↗ 4.0%</span></div>
                  <div class="subscription-plan-row"><div class="plan-cell"><i class="plan-dot" style="background:#a58fff"></i>Growth</div><span>$29</span><span>900</span><span>31.6%</span><strong style="color:#e7e4ee">$26,100</strong><span>3.6%</span><span class="table-trend">↗ 7.0%</span></div>
                  <div class="subscription-plan-row"><div class="plan-cell"><i class="plan-dot" style="background:#5c6fba"></i>Pro</div><span>$49</span><span>453</span><span>15.9%</span><strong style="color:#e7e4ee">$22,197</strong><span>2.9%</span><span class="table-trend">↗ 11.0%</span></div>
                  <div class="subscription-plan-row"><div class="plan-cell"><i class="plan-dot" style="background:#3a3e50"></i>Teams</div><span>$99</span><span>167</span><span>5.9%</span><strong style="color:#e7e4ee">$16,533</strong><span>2.1%</span><span class="table-trend">↗ 12.0%</span></div>
                </div>
              </article>

              <article class="card subscription-status-card">
                <div class="card-header"><div><div class="card-title">Subscription Status</div><div class="card-subtitle">Current state and period activity</div></div><button class="app-btn ghost" style="min-height:32px;padding:0 9px">Details</button></div>
                <div class="status-visual"><div class="status-donut"><div class="status-donut-center"><strong>3,164</strong><span>Current subscriptions</span></div></div><div class="status-legend">
                  <div class="status-legend-row"><span class="status-legend-label"><i style="background:#7c5cff"></i>Active</span><strong>2,846</strong></div>
                  <div class="status-legend-row"><span class="status-legend-label"><i style="background:#a58fff"></i>Trialing</span><strong>214</strong></div>
                  <div class="status-legend-row"><span class="status-legend-label"><i style="background:#ff7a90"></i>Past due</span><strong>63</strong></div>
                  <div class="status-legend-row"><span class="status-legend-label"><i style="background:#5c6f8f"></i>Paused</span><strong>41</strong></div>
                </div></div>
                <div class="status-period-metrics"><div class="status-period-metric"><span>Churned during selected period</span><strong>104</strong></div><div class="status-period-metric"><span>Churn rate</span><strong>3.84%</strong></div></div>
              </article>
            </div>

            <section class="card subscription-table-card" aria-label="All subscriptions table">
              <div class="subscription-table-toolbar"><div><h2>All Subscriptions</h2><p>Plan, billing cycle and subscription lifecycle status</p></div><div class="subscription-table-tools"><label class="search"><svg class="icon sm"><use href="#i-search"/></svg><input type="search" placeholder="Search subscriptions" aria-label="Search subscriptions"></label><button class="app-btn ghost compact-select">All plans <svg class="icon sm"><use href="#i-down"/></svg></button><button class="app-btn ghost compact-select">All statuses <svg class="icon sm"><use href="#i-down"/></svg></button></div></div>
              <div class="subscriptions-table-head"><span>Customer</span><span>Plan</span><span>Status</span><span>Billing Cycle</span><span>Started</span><span class="sort-label">Next Billing <b>↓</b></span><span>Amount</span><span></span></div>
              <div class="subscriptions-table-row"><div class="customer-identity"><div class="avatar">OC</div><strong>Olivia Chen</strong></div><span class="plan-badge growth">Growth</span><span><i class="status status-active">Active</i></span><span class="billing-cycle">Monthly</span><span>May 18, 2026</span><span>Jul 18, 2026</span><span class="subscription-amount">$29<small>per month</small></span><span class="row-action">⋯</span></div>
              <div class="subscriptions-table-row"><div class="customer-identity"><div class="avatar">NW</div><strong>Noah Williams</strong></div><span class="plan-badge teams">Teams</span><span><i class="status status-active">Active</i></span><span class="billing-cycle">Annual</span><span>Apr 02, 2026</span><span>Apr 02, 2027</span><span class="subscription-amount">$1,188<small>per year</small></span><span class="row-action">⋯</span></div>
              <div class="subscriptions-table-row"><div class="customer-identity"><div class="avatar">AT</div><strong>Ava Thompson</strong></div><span class="plan-badge pro">Pro</span><span><i class="status status-trial">Trialing</i></span><span class="billing-cycle">Monthly</span><span>Jul 08, 2026</span><span>Jul 22, 2026</span><span class="subscription-amount">$49<small>after trial</small></span><span class="row-action">⋯</span></div>
              <div class="subscriptions-table-row"><div class="customer-identity"><div class="avatar">MR</div><strong>Marco Ruiz</strong></div><span class="plan-badge starter">Starter</span><span><i class="status status-due">Past due</i></span><span class="billing-cycle">Monthly</span><span>Mar 21, 2026</span><span>Jul 21, 2026</span><span class="subscription-amount">$15<small>per month</small></span><span class="row-action">⋯</span></div>
              <div class="subscriptions-table-row"><div class="customer-identity"><div class="avatar">MP</div><strong>Maya Patel</strong></div><span class="plan-badge growth">Growth</span><span><i class="status status-active">Active</i></span><span class="billing-cycle">Annual</span><span>Feb 14, 2026</span><span>Feb 14, 2027</span><span class="subscription-amount">$348<small>per year</small></span><span class="row-action">⋯</span></div>
              <div class="subscriptions-table-row"><div class="customer-identity"><div class="avatar">EB</div><strong>Ethan Brooks</strong></div><span class="plan-badge pro">Pro</span><span><i class="status status-paused">Paused</i></span><span class="billing-cycle">Monthly</span><span>Jan 29, 2026</span><span>Paused</span><span class="subscription-amount">$49<small>per month</small></span><span class="row-action">⋯</span></div>
              <div class="subscriptions-table-row selected"><div class="customer-identity"><div class="avatar">SN</div><strong>Sophia Nguyen</strong></div><span class="plan-badge teams">Teams</span><span><i class="status status-active">Active</i></span><span class="billing-cycle">Monthly</span><span>Dec 11, 2025</span><span>Aug 11, 2026</span><span class="subscription-amount">$99<small>per month</small></span><span class="row-action">⋯</span></div>
              <div class="subscriptions-table-row"><div class="customer-identity"><div class="avatar">LC</div><strong>Liam Carter</strong></div><span class="plan-badge starter">Starter</span><span><i class="status status-canceled">Canceled</i></span><span class="billing-cycle">Monthly</span><span>Nov 06, 2025</span><span>—</span><span class="subscription-amount">$15<small>former monthly</small></span><span class="row-action">⋯</span></div>
              <div class="table-footer"><span>Showing 1–8 of 3,268 subscription records</span><div class="rows-select"><span>Rows per page</span><span>8 <svg class="icon sm"><use href="#i-down"/></svg></span></div><div class="pagination"><span class="page-btn">‹</span><span class="page-btn active">1</span><span class="page-btn">2</span><span class="page-btn">3</span><span class="page-ellipsis">…</span><span class="page-btn">409</span><span class="page-btn">›</span></div></div>
            </section>
          </section>
        </article>
      </div>
    </section>

    <section class="view" id="view-settings">
      <div class="stage center">
        <article class="artboard desktop-artboard settings-page" aria-label="Subtera settings desktop dashboard">
          <aside class="sidebar">
            <div class="app-logo"><span class="brand-mark">S</span><span>Subtera</span></div>
            <div class="workspace"><div class="workspace-logo"><svg class="icon"><use href="#i-grid"/></svg></div><div class="workspace-copy"><div class="eyebrow">Workspace</div><div class="workspace-name">Acme Cloud</div></div><svg class="icon sm"><use href="#i-down"/></svg></div>
            <div class="search"><svg class="icon sm"><use href="#i-search"/></svg><span>Search</span><span class="shortcut">⌘ K</span></div>
            <div class="nav-label">Workspace</div>
            <nav class="nav-group">
              <div class="nav-item"><svg class="icon"><use href="#i-grid"/></svg><span>Overview</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-chart"/></svg><span>Analytics</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-users"/></svg><span>Customers</span></div>
              <div class="nav-item"><svg class="icon"><use href="#i-card"/></svg><span>Subscriptions</span></div>
              <div class="nav-item active"><svg class="icon"><use href="#i-settings"/></svg><span>Settings</span></div>
            </nav>
            <div class="sidebar-bottom"><div class="profile-row"><div class="avatar">MC</div><div class="profile-copy"><div class="profile-name">Maya Chen</div><div class="profile-role">Workspace Admin</div></div><svg class="icon sm"><use href="#i-chevron"/></svg></div></div>
          </aside>

          <header class="topbar">
            <div class="breadcrumb"><strong>Dashboard</strong><span class="crumb-sep">/</span><span>Settings</span></div>
            <div class="top-actions"><div class="icon-btn"><svg class="icon"><use href="#i-help"/></svg></div><div class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><i class="notify-dot"></i></div><div class="top-profile"><div class="avatar">MC</div><svg class="icon sm"><use href="#i-down"/></svg></div></div>
          </header>

          <section class="main-content">
            <div class="page-heading"><div><h1>Settings</h1><p>Manage workspace preferences, reporting defaults and notifications.</p></div><div class="heading-actions"><button class="app-btn ghost">Discard changes</button><button class="app-btn primary">Save changes</button></div></div>

            <nav class="card settings-subnav" aria-label="Settings sections"><span class="settings-subnav-item active">General</span><span class="settings-subnav-item">Reporting</span><span class="settings-subnav-item">Notifications</span><span class="settings-subnav-item">Billing</span><span class="settings-subnav-item">Integrations</span></nav>

            <div class="settings-grid">
              <div class="settings-column">
                <section class="card settings-card workspace-settings">
                  <div class="settings-section-heading"><div><h2>Workspace Profile</h2><p>Identity and contact information used across Subtera.</p></div></div>
                  <div class="logo-setting"><div class="logo-upload">A</div><div class="logo-setting-copy"><strong>Workspace logo</strong><span>SVG, PNG or JPG · Recommended 256 × 256 px</span></div><button class="app-btn ghost" style="min-height:34px;padding:0 10px">Change logo</button></div>
                  <div class="field-grid">
                    <label class="field"><span class="field-label">Workspace name</span><input class="field-control" value="Acme Cloud" aria-label="Workspace name"></label>
                    <div class="field"><span class="field-label">Workspace ID or slug</span><div class="field-control">acme-cloud</div><span class="field-helper">Used in workspace links and exports.</span></div>
                    <label class="field"><span class="field-label">Company name</span><input class="field-control" value="Acme Cloud Inc." aria-label="Company name"></label>
                    <div class="field"><span class="field-label">Workspace owner</span><div class="field-control disabled">Maya Chen</div><span class="field-helper">Owner changes require workspace verification.</span></div>
                    <label class="field span-2"><span class="field-label">Support email</span><input class="field-control" value="support@acmecloud.io" aria-label="Support email"></label>
                  </div>
                </section>

                <section class="card settings-card regional-settings">
                  <div class="settings-section-heading"><div><h2>Regional Preferences</h2><p>Formatting defaults for workspace reports and tables.</p></div></div>
                  <div class="regional-grid">
                    <div class="field"><span class="field-label">Time zone</span><div class="field-control">Europe/Berlin <svg class="icon sm"><use href="#i-down"/></svg></div></div>
                    <div class="field"><span class="field-label">Currency</span><div class="field-control">USD — US Dollar <svg class="icon sm"><use href="#i-down"/></svg></div></div>
                    <div class="field"><span class="field-label">Language</span><div class="field-control">English <svg class="icon sm"><use href="#i-down"/></svg></div></div>
                    <div class="field"><span class="field-label">Date format</span><div class="field-control">MM/DD/YYYY <svg class="icon sm"><use href="#i-down"/></svg></div></div>
                    <div class="field"><span class="field-label">Week starts on</span><div class="field-control">Monday <svg class="icon sm"><use href="#i-down"/></svg></div></div>
                  </div>
                  <div class="info-message"><i>i</i><span>Changing the time zone updates report grouping and display only. Stored transaction timestamps remain unchanged.</span></div>
                </section>

                <section class="card settings-card danger-settings">
                  <div class="settings-section-heading"><div><h2 style="color:#dfc7cd">Danger Zone</h2><p>Permanent workspace actions require additional confirmation.</p></div></div>
                  <div class="danger-body"><p>Deleting this workspace removes its reporting configuration and disconnects all linked customer data. This action cannot be undone.</p><button class="app-btn danger-btn">Delete workspace</button></div>
                </section>
              </div>

              <div class="settings-column">
                <section class="card settings-card reporting-settings">
                  <div class="settings-section-heading"><div><h2>Reporting Defaults</h2><p>Starting state for analytics and exported reports.</p></div></div>
                  <div class="setting-list">
                    <div class="setting-row"><div class="setting-row-copy"><strong>Default reporting period</strong><span>Initial date range used across dashboards.</span></div><div class="inline-select">Last 30 days <svg class="icon sm"><use href="#i-down"/></svg></div></div>
                    <div class="setting-row"><div class="setting-row-copy"><strong>Compare with previous period</strong><span>Show comparison data by default.</span></div><span class="toggle on" aria-label="Enabled"></span></div>
                    <div class="setting-row"><div class="setting-row-copy"><strong>Default revenue view</strong><span>Primary value used in revenue charts.</span></div><div class="inline-select">Gross Revenue <svg class="icon sm"><use href="#i-down"/></svg></div></div>
                    <div class="setting-row"><div class="setting-row-copy"><strong>Default chart granularity</strong><span>Grouping used for trend visualizations.</span></div><div class="inline-select">Weekly <svg class="icon sm"><use href="#i-down"/></svg></div></div>
                    <div class="setting-row"><div class="setting-row-copy"><strong>Include trial accounts in customer totals</strong><span>Trials appear in customer-account counts.</span></div><span class="toggle on" aria-label="Enabled"></span></div>
                  </div>
                </section>

                <section class="card settings-card notification-settings">
                  <div class="settings-section-heading"><div><h2>Notifications</h2><p>Choose which workspace events generate alerts.</p></div></div>
                  <div class="setting-list">
                    <div class="setting-row"><div class="setting-row-copy"><strong>Weekly performance summary</strong><span>Recurring revenue and subscriber movement every Monday.</span></div><span class="toggle on" aria-label="Enabled"></span></div>
                    <div class="setting-row"><div class="setting-row-copy"><strong>Churn alerts</strong><span>Notify when cancellation activity exceeds the usual range.</span></div><span class="toggle on" aria-label="Enabled"></span></div>
                    <div class="setting-row"><div class="setting-row-copy"><strong>Failed payment alerts</strong><span>Flag subscriptions requiring billing attention.</span></div><span class="toggle on" aria-label="Enabled"></span></div>
                    <div class="setting-row"><div class="setting-row-copy"><strong>Trial expiration reminders</strong><span>Receive a reminder three days before trial completion.</span></div><span class="toggle on" aria-label="Enabled"></span></div>
                    <div class="setting-row"><div class="setting-row-copy"><strong>Large MRR change alerts</strong><span>Notify for individual MRR changes above $1,000.</span></div><span class="toggle" aria-label="Disabled"></span></div>
                  </div>
                </section>

                <section class="card settings-card privacy-settings">
                  <div class="settings-section-heading"><div><h2>Data and Privacy</h2><p>Workspace exports, retention and synchronization status.</p></div></div>
                  <div class="privacy-actions"><button class="app-btn ghost"><svg class="icon sm"><use href="#i-export"/></svg>Export workspace data</button><button class="app-btn ghost"><svg class="icon sm"><use href="#i-export"/></svg>Download customer data</button></div>
                  <div class="privacy-meta"><div class="privacy-meta-item"><span>Data retention</span><strong>24 months</strong></div><div class="privacy-meta-item"><span>Last successful data sync</span><strong>Jul 14, 2026 at 10:42</strong></div></div>
                </section>
              </div>
            </div>
          </section>
        </article>
      </div>
    </section>

    <section class="view" id="view-mobile">
      <div class="stage center mobile-stage">
        <article class="artboard phone-artboard mobile-page" aria-label="Subtera overview mobile dashboard">
          <header class="mobile-bar"><div class="app-logo"><span class="brand-mark" style="width:27px;height:27px;border-radius:8px">S</span><span>Subtera</span></div><div class="mobile-actions"><div class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><i class="notify-dot"></i></div><div class="icon-btn"><svg class="icon"><use href="#i-menu"/></svg></div></div></header>
          <div class="mobile-content">
            <div class="mobile-heading"><h1>Overview</h1><p>Monitor recurring revenue, subscriptions and customer activity.</p></div>
            <button class="app-btn mobile-date"><span><svg class="icon sm" style="display:inline-block;vertical-align:-3px;margin-right:7px"><use href="#i-calendar"/></svg>Jun 15 – Jul 14, 2026</span><svg class="icon sm"><use href="#i-down"/></svg></button>
            <div class="mobile-kpis">
              <article class="card kpi highlight"><div class="kpi-top"><span class="kpi-label">Monthly Recurring Revenue</span></div><div class="kpi-value">$84,720</div><div class="kpi-foot"><span class="trend positive">↗ 8.4%</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C14 22 16 19 25 20 S38 11 47 14 S62 8 78 4" fill="none" stroke="#8b6cff" stroke-width="2"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Annual Recurring Revenue</span></div><div class="kpi-value">$1,016,640</div><div class="kpi-foot"><span class="trend positive">↗ 8.4%</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C14 22 16 19 25 20 S38 11 47 14 S62 8 78 4" fill="none" stroke="#8077a7" stroke-width="1.8"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Active Subscriptions</span></div><div class="kpi-value">2,846</div><div class="kpi-foot"><span class="trend positive">↗ 5.2%</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 25 C12 23 18 17 27 19 S42 14 51 12 S67 9 78 5" fill="none" stroke="#737992" stroke-width="1.8"/></svg></article>
              <article class="card kpi"><div class="kpi-top"><span class="kpi-label">Churn Rate</span></div><div class="kpi-value">3.84%</div><div class="kpi-foot"><span class="trend improve">↓ 0.43 pp</span></div><svg class="spark" viewBox="0 0 80 30"><path d="M2 5 C14 9 20 7 28 12 S43 15 52 18 S66 22 78 25" fill="none" stroke="#5a776d" stroke-width="1.8"/></svg></article>
            </div>

            <article class="card mobile-card mobile-revenue"><div class="card-header"><div><div class="card-title">Revenue Overview</div><div class="card-subtitle">Gross revenue · selected period</div></div><div class="segment"><span class="active">Revenue</span><span>MRR</span></div></div><div class="revenue-total"><strong>$112,480</strong><span class="trend positive">↗ 9.6%</span></div><div class="chart-wrap"><svg viewBox="0 0 340 200" role="img" aria-label="Mobile cumulative gross revenue chart"><defs><linearGradient id="mobileFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c5cff" stop-opacity=".24"/><stop offset="1" stop-color="#7c5cff" stop-opacity="0"/></linearGradient></defs><g><line class="chart-grid" x1="35" y1="25" x2="325" y2="25"/><line class="chart-grid" x1="35" y1="68" x2="325" y2="68"/><line class="chart-grid" x1="35" y1="111" x2="325" y2="111"/><line class="chart-grid" x1="35" y1="154" x2="325" y2="154"/></g><g class="chart-label"><text x="4" y="28">$120k</text><text x="10" y="71">$80k</text><text x="10" y="114">$40k</text><text x="24" y="157">$0</text><text x="35" y="180">Jun 15</text><text x="157" y="180">Jun 29</text><text x="291" y="180">Jul 14</text></g><path d="M36 129 C65 123 78 103 108 96 S149 76 178 66 S220 39 248 34 S292 30 318 28 L318 154 L36 154Z" fill="url(#mobileFill)"/><path class="chart-previous" d="M36 133 C70 127 80 109 108 103 S150 86 178 76 S220 52 248 45 S292 40 318 38"/><path class="chart-current" d="M36 129 C65 123 78 103 108 96 S149 76 178 66 S220 39 248 34 S292 30 318 28"/></svg></div></article>

            <article class="card mobile-card mobile-customer"><div class="card-header"><div><div class="card-title">Customer Growth</div><div class="card-subtitle">New subscriptions and churn</div></div><span class="trend positive">↗ 9.8%</span></div><div class="customer-top"><strong>3,214</strong><span style="color:#6f7280;font-size:9px;margin-bottom:4px">accounts</span></div><div class="customer-chart"><svg viewBox="0 0 340 165"><line class="chart-grid" x1="15" y1="35" x2="325" y2="35"/><line class="chart-grid" x1="15" y1="87" x2="325" y2="87"/><line class="chart-grid" x1="15" y1="135" x2="325" y2="135"/><path d="M24 81 C70 78 92 68 118 66 S185 60 207 56 S276 34 318 29" fill="none" stroke="#8b6cff" stroke-width="2.2"/><path d="M24 128 C74 127 93 116 118 115 S177 124 207 125 S276 118 318 117" fill="none" stroke="#ff7a90" stroke-width="1.8"/></svg></div><div class="legend"><span><i style="background:#8b6cff"></i>New</span><span><i style="background:#ff7a90"></i>Churned</span></div><div class="customer-summary"><div class="summary-item"><span>New</span><strong>245</strong></div><div class="summary-item"><span>Churned</span><strong>104</strong></div><div class="summary-item"><span>Net</span><strong style="color:#67dda9">+141</strong></div></div></article>

            <article class="card mobile-card mobile-plans"><div class="card-header"><div><div class="card-title">Subscriptions by Plan</div><div class="card-subtitle">Active subscriptions and MRR</div></div></div><div class="plans-body"><div class="donut"><div class="donut-center"><strong>2,846</strong><span>ACTIVE</span></div></div><div class="plan-list"><div class="plan-row"><div><div class="plan-name"><i class="plan-dot" style="background:#7c5cff"></i>Starter · $15</div><div class="plan-meta">1,326 · 46.6%</div></div><div class="plan-value">$19,890<small>MRR</small></div></div><div class="plan-row"><div><div class="plan-name"><i class="plan-dot" style="background:#a58fff"></i>Growth · $29</div><div class="plan-meta">900 · 31.6%</div></div><div class="plan-value">$26,100<small>MRR</small></div></div><div class="plan-row"><div><div class="plan-name"><i class="plan-dot" style="background:#5c6fba"></i>Pro · $49</div><div class="plan-meta">453 · 15.9%</div></div><div class="plan-value">$22,197<small>MRR</small></div></div><div class="plan-row"><div><div class="plan-name"><i class="plan-dot" style="background:#3a3e50"></i>Teams · $99</div><div class="plan-meta">167 · 5.9%</div></div><div class="plan-value">$16,533<small>MRR</small></div></div></div></div></article>

            <article class="card mobile-card mobile-transactions"><div class="card-header"><div><div class="card-title">Recent Transactions</div><div class="card-subtitle">Latest subscription payments</div></div><button class="app-btn ghost" style="min-height:32px;padding:0 10px">View all</button></div><div class="mobile-transaction-list">
              <div class="mobile-transaction"><div class="mobile-customer-cell"><div class="avatar">OC</div><div class="mobile-customer-copy"><strong>Olivia Chen</strong><span>Growth · Jul 14, 10:42</span></div></div><div class="mobile-amount"><strong>$29.00</strong><i class="status paid">Paid</i></div></div>
              <div class="mobile-transaction"><div class="mobile-customer-cell"><div class="avatar">NL</div><div class="mobile-customer-copy"><strong>Northstar Labs</strong><span>Teams · Jul 14, 09:18</span></div></div><div class="mobile-amount"><strong>$99.00</strong><i class="status paid">Paid</i></div></div>
              <div class="mobile-transaction"><div class="mobile-customer-cell"><div class="avatar">MR</div><div class="mobile-customer-copy"><strong>Marco Ruiz</strong><span>Starter · Jul 13, 17:05</span></div></div><div class="mobile-amount"><strong>$15.00</strong><i class="status refunded">Refunded</i></div></div>
              <div class="mobile-transaction"><div class="mobile-customer-cell"><div class="avatar">AT</div><div class="mobile-customer-copy"><strong>Ava Thompson</strong><span>Pro · Jul 13, 14:22</span></div></div><div class="mobile-amount"><strong>$49.00</strong><i class="status pending">Pending</i></div></div>
              <div class="mobile-transaction"><div class="mobile-customer-cell"><div class="avatar">KS</div><div class="mobile-customer-copy"><strong>Koto Studio</strong><span>Teams · Jul 12, 16:41</span></div></div><div class="mobile-amount"><strong>$99.00</strong><i class="status failed">Failed</i></div></div>
            </div></article>
          </div>
        </article>
      </div>
    </section>

    <section class="view" id="view-drawer">
      <div class="stage center">
        <article class="artboard drawer-artboard" aria-label="Subtera mobile navigation drawer visible state"><div class="drawer-backdrop-content"><div class="ghost-block"></div><div class="ghost-block"></div></div><div class="drawer-backdrop"></div><aside class="drawer"><div class="drawer-head"><div class="app-logo"><span class="brand-mark" style="width:28px;height:28px;border-radius:8px">S</span><span>Subtera</span></div><button class="drawer-close" aria-label="Close navigation"><svg class="icon"><use href="#i-x"/></svg></button></div><div class="workspace"><div class="workspace-logo"><svg class="icon"><use href="#i-grid"/></svg></div><div class="workspace-copy"><div class="eyebrow">Workspace</div><div class="workspace-name">Acme Cloud</div></div><svg class="icon sm"><use href="#i-down"/></svg></div><div class="search"><svg class="icon sm"><use href="#i-search"/></svg><span>Search workspace</span></div><nav class="nav-group"><div class="nav-item active"><svg class="icon"><use href="#i-grid"/></svg>Overview</div><div class="nav-item"><svg class="icon"><use href="#i-chart"/></svg>Analytics</div><div class="nav-item"><svg class="icon"><use href="#i-users"/></svg>Customers</div><div class="nav-item"><svg class="icon"><use href="#i-card"/></svg>Subscriptions</div><div class="nav-item"><svg class="icon"><use href="#i-settings"/></svg>Settings</div></nav><div class="profile-row"><div class="avatar">MC</div><div class="profile-copy"><div class="profile-name">Maya Chen</div><div class="profile-role">Workspace Admin</div></div><svg class="icon sm"><use href="#i-chevron"/></svg></div></aside></article>
      </div>
    </section>

    <section class="view" id="view-kit">
      <div class="stage center">
        <article class="artboard kit-artboard" aria-label="Subtera mini UI kit board">
          <div class="kit-head"><div><h1>Subtera Mini UI Kit</h1><p>Shared foundations and components for the Subtera product experience.</p></div><div class="kit-version">Dark theme · Concept 01</div></div>
          <section class="kit-section"><div class="kit-section-title">Foundations</div><div class="foundation-grid">
            <div class="kit-panel"><div class="component-label">Core colors</div><div class="swatches"><div class="swatch" style="background:#08090e">Canvas</div><div class="swatch" style="background:#11121a">Surface</div><div class="swatch" style="background:#1b1d29">Raised</div><div class="swatch" style="background:#f5f3ff;color:#171820">Text</div><div class="swatch" style="background:#7c5cff">Violet</div><div class="swatch" style="background:#5c7cfa">Blue</div></div></div>
            <div class="kit-panel type-sample"><div class="component-label">Typography · Manrope</div><h2>Subscription clarity.</h2><p>28 / 36 · Bold &nbsp; · &nbsp; Body 14 / 22 · Regular</p></div>
            <div class="kit-panel"><div class="component-label">Spacing</div><div class="spacing-row"><div class="space-bar" style="height:8px"></div><div class="space-bar" style="height:12px"></div><div class="space-bar" style="height:16px"></div><div class="space-bar" style="height:24px"></div><div class="space-bar" style="height:32px"></div><div class="space-bar" style="height:48px"></div></div></div>
            <div class="kit-panel"><div class="component-label">Radiuses</div><div class="radius-row"><div class="radius-sample" style="border-radius:12px">12</div><div class="radius-sample" style="border-radius:16px">16</div><div class="radius-sample" style="border-radius:999px">Pill</div></div></div>
          </div></section>
          <section class="kit-section"><div class="kit-section-title">Controls & navigation</div><div class="kit-components">
            <div class="component-panel"><div class="component-label">Button · Icon Button</div><div class="component-row"><button class="app-btn">Export report</button><button class="app-btn ghost">Filters</button><div class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><i class="notify-dot"></i></div></div></div>
            <div class="component-panel"><div class="component-label">Search Input</div><div class="search"><svg class="icon sm"><use href="#i-search"/></svg><span>Search</span><span class="shortcut">⌘ K</span></div></div>
            <div class="component-panel"><div class="component-label">Date Range / Select</div><button class="app-btn date-btn"><span><svg class="icon sm" style="display:inline-block;vertical-align:-3px;margin-right:7px"><use href="#i-calendar"/></svg>Jun 15 – Jul 14, 2026</span><svg class="icon sm"><use href="#i-down"/></svg></button></div>
            <div class="component-panel"><div class="component-label">Workspace Switcher</div><div class="workspace"><div class="workspace-logo"><svg class="icon"><use href="#i-grid"/></svg></div><div class="workspace-copy"><div class="eyebrow">Workspace</div><div class="workspace-name">Acme Cloud</div></div><svg class="icon sm"><use href="#i-down"/></svg></div></div>
            <div class="component-panel"><div class="component-label">Navigation Item</div><div class="component-row"><div class="nav-item active"><svg class="icon"><use href="#i-grid"/></svg>Overview</div><div class="nav-item"><svg class="icon"><use href="#i-chart"/></svg>Analytics</div></div></div>
            <div class="component-panel"><div class="component-label">Profile Row</div><div class="profile-row"><div class="avatar">MC</div><div class="profile-copy"><div class="profile-name">Maya Chen</div><div class="profile-role">Workspace Admin</div></div><svg class="icon sm"><use href="#i-chevron"/></svg></div></div>
          </div></section>
          <section class="kit-section"><div class="kit-section-title">Data display</div><div class="kit-components">
            <div class="component-panel"><div class="component-label">Trend Badges</div><div class="component-row"><span class="trend positive">↗ 8.4%</span><span class="trend negative">↘ 2.1%</span><span class="trend improve">↓ 0.43 pp</span></div></div>
            <div class="component-panel"><div class="component-label">Status Badges</div><div class="component-row"><i class="status paid">Paid</i><i class="status pending">Pending</i><i class="status refunded">Refunded</i><i class="status failed">Failed</i></div></div>
            <div class="component-panel"><div class="component-label">Plan Row</div><div class="plan-row kit-plan"><div><div class="plan-name"><i class="plan-dot" style="background:#a58fff"></i>Growth <span class="plan-meta">· $29</span></div><div class="plan-meta">900 · 31.6%</div></div><div class="plan-value">$26,100<small>MRR</small></div></div></div>
            <div class="component-panel"><div class="component-label">KPI Card</div><article class="card kpi highlight mini-kpi"><div class="kpi-top"><span class="kpi-label">Monthly Recurring Revenue</span><span class="metric-icon"><svg class="icon"><use href="#i-dollar"/></svg></span></div><div class="kpi-value">$84,720</div><div class="kpi-foot"><span class="trend positive">↗ 8.4%</span><span class="kpi-note">+$6,580 net increase</span></div></article></div>
            <div class="component-panel"><div class="component-label">Analytics Card</div><article class="card mini-analytics"><div class="card-header"><div class="card-title">Revenue Overview</div><span class="trend positive">↗ 9.6%</span></div><svg viewBox="0 0 300 60"><path d="M4 54 C45 49 72 42 98 39 S154 27 180 24 S243 12 296 7" fill="none" stroke="#8b6cff" stroke-width="2"/><path d="M4 57 C42 54 68 49 98 46 S154 37 180 34 S242 23 296 18" fill="none" stroke="#555968" stroke-dasharray="4 5"/></svg></article></div>
            <div class="component-panel"><div class="component-label">Desktop Transaction Row</div><div class="transaction-row kit-transaction"><div class="customer-cell"><div class="avatar">OC</div><span>Olivia Chen</span></div><span>Growth</span><span class="amount">$29.00</span><span><i class="status paid">Paid</i></span></div></div>
            <div class="component-panel"><div class="component-label">Mobile Transaction Row</div><div class="mobile-transaction kit-mobile-row"><div class="mobile-customer-cell"><div class="avatar">AT</div><div class="mobile-customer-copy"><strong>Ava Thompson</strong><span>Pro · Jul 13</span></div></div><div class="mobile-amount"><strong>$49.00</strong><i class="status pending">Pending</i></div></div></div>
          </div></section>
          <section class="kit-section"><div class="kit-section-title">Product controls & patterns</div><div class="kit-expanded-grid">
            <div class="kit-pattern-panel"><div class="component-label">Actions · Tabs · Toggles</div><div class="kit-pattern-row"><button class="app-btn primary">Add customer</button><button class="app-btn">Export report</button><div class="segment"><span class="active">All</span><span>Active</span><span>Trial</span></div></div><div class="kit-pattern-row"><span style="color:#858795;font-size:8px">Enabled</span><span class="toggle on"></span><span style="color:#858795;font-size:8px;margin-left:8px">Disabled</span><span class="toggle"></span></div></div>
            <div class="kit-pattern-panel"><div class="component-label">Text Input · Select · Form Field</div><div class="kit-pattern-row"><input class="kit-input" value="Acme Cloud" aria-label="Example text input"><div class="kit-select">Europe/Berlin <svg class="icon sm"><use href="#i-down"/></svg></div></div><div class="kit-form-example" style="margin-top:14px"><span class="field-label">Workspace ID or slug</span><div class="field-control">acme-cloud</div><span class="field-helper">Used in workspace links and exports.</span></div></div>
            <div class="kit-pattern-panel"><div class="component-label">Table Header · Standard & Selected Rows · Pagination</div><div class="kit-table-demo"><div class="kit-table-head"><span>Customer</span><span>Plan</span><span>Status</span><span>Value</span></div><div class="kit-table-row-demo"><strong style="color:#e0dde8">Olivia Chen</strong><span>Growth</span><span><i class="status status-active">Active</i></span><strong>$29</strong></div><div class="kit-table-row-demo selected"><strong>Marco Ruiz</strong><span>Starter</span><span><i class="status status-due">Past due</i></span><strong>$15</strong></div></div><div class="kit-pagination"><span class="page-btn">‹</span><span class="page-btn active">1</span><span class="page-btn">2</span><span class="page-btn">3</span><span class="page-btn">›</span></div></div>
            <div class="kit-pattern-panel"><div class="component-label">Informational Message</div><div class="info-message kit-info"><i>i</i><span>Changing the time zone updates report grouping and display only. Stored transaction timestamps remain unchanged.</span></div><div style="margin-top:17px;color:#676a78;font-size:8px;line-height:1.6">Use helper and informational states for guidance without interrupting the primary workflow.</div></div>
          </div></section>
        </article>
      </div>
    </section>
  </main>

  <script>
    const tabs = Array.from(document.querySelectorAll('.tab'));
    const views = Array.from(document.querySelectorAll('.view'));
    function selectView(name) {
      tabs.forEach(function(tab) { tab.classList.toggle('active', tab.dataset.view === name); });
      views.forEach(function(view) { view.classList.toggle('active', view.id === 'view-' + name); });
      if (history.replaceState) history.replaceState(null, '', '#' + name);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    tabs.forEach(function(tab) { tab.addEventListener('click', function() { selectView(tab.dataset.view); }); });
    const requestedView = location.hash.replace('#', '');
    if (requestedView && tabs.some(function(tab) { return tab.dataset.view === requestedView; })) selectView(requestedView);
  </script>
</body>
</html>`;

const subteraPrototypeWorker = {
  async fetch(request, env, ctx) {
    void env;
    void ctx;

    const url = new URL(request.url);

    if (url.pathname !== "/") {
      return new Response("Not found", { status: 404 });
    }

    return new Response(page, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "public, max-age=60",
      },
    });
  },
};

export default subteraPrototypeWorker;
