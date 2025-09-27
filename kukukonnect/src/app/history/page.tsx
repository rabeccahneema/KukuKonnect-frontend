'use client'

import FarmerLayout from '../shared-components/FarmerLayout';
import HistoryBarChart from './components/Chart';


export default function History (){
    return(
        <FarmerLayout>
         <div>
            <HistoryBarChart/>
           
         </div>
         </FarmerLayout>

    )
   
}