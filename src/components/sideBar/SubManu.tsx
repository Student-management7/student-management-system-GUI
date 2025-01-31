import React from 'react';
import { Link } from "react-router-dom";




const SubManu = (props: any) =>{

const { data } = props;

return(

    <>
        
        {data && data?.map((item: any)=>{

            const Icon: any = item?.icon;
            return(
                    <>
                    
                      <p className='subMenu' key={item.title}>
                      {Icon && <Icon className=""/>}  
                        <span> <Link to={item.path} className="submenudata">{item.title}</Link> </span> 
                        </p>
                    </>
                    );
    
                    

            })
    
        }   
    </>
);

}

export default SubManu;