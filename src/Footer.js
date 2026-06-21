import './style.css';


const Footer=()=>
{
	return(
	     <>
       <br/> <br/>
	     <footer id="footers" className="container-fluid bg-dark m-0 w-100">  {/* fixed-bottom */}
        <div class="container text-center">
  <div class="row">
    <div class="col-2">
      <a href="https://www.facebook.com/profile.php?id=100077608031333" target="blank">
        <i class="fa-brands fa-facebook-f" style={{fontSize:"20px", color:"red"}}></i> </a>
    </div>
    <div class="col">
       <span className="text-danger"> Designed and Developed by Mr. Dhiraj Patel &#169; COPYRIGHT RESERVED 2026 <br /></span>
        <span  className="text-success bg-transparent text-center" > <i class="fa fa-phone" aria-hidden="true">
        </i> Help Line No:- 7869527457</span>
    </div>
  </div>
</div>
       </footer>

          </>
		); 
	}
   
export default Footer;