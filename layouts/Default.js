const Layout = ({ children }) => {
  return ( 
    <>
      <div className="page-wrapper min-h-screen bg-slate-900 text-slate-100">{ children }</div>
    </>
  );
}
 
export default Layout;