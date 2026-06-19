import './style.css';


const Footer=()=>
{
	return(
	     <>
       <br/> <br/><br/><br/><br/>
	     <footer id="footers" className="container-fluid m-0 ">
       <div className="container-fluid bg-dark fixed-bottom p-2"> 
       <table className="table">
       <tr>
       <td className="text-success bg-transparent"><a href="https://www.facebook.com/profile.php?id=100077608031333" target="blank"> <i class="fa-brands fa-facebook-f" style={{fontSize:"20px", color:"red"}}></i> </a></td>
       <td className="text-center text-danger">
        Designed and Developed by Mr. Dhiraj Patel &#169; COPYRIGHT RESERVED 2026  <br/>
        <span  className="text-success bg-transparent"> <i class="fa fa-phone" aria-hidden="true"></i> Help Line No:- 7869527457</span>
        </td>
        </tr>
        </table>
        </div>
       </footer>

          </>
		); 
	}
   
export default Footer;