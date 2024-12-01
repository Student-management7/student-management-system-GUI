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
                      {Icon && <Icon />}  
                        <span> <Link to={item.path} className="hover:text-blue-600 transition-colors">{item.title}</Link> </span> 
                        </p>
                    </>
                    );
    

            })
    
        }   
    </>
);

}

export default SubManu;