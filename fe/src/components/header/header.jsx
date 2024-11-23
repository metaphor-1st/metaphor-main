import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.svg"
import "./header.css"

function Header() {
  const navigate = useNavigate();

    const handleClick = () => {
      navigate("/");
    };
  return (
    <div className="HeaderWrap">
      <img src={logo} alt="logo" onClick={handleClick} style={{cursor:"pointer"}}></img>
    </div>
  );
}
export default Header;
