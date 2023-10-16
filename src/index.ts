import 'module-alias/register.js';
import 'dotenv/config'
import 'reflect-metadata';
import {bootstrap} from "./utils/repositories/bootstrap.js";
//import {bootstrap} from "@/utils/repositories/bootstrap.js";

import validateEnv from 'utils/validateEnv';


bootstrap().then(app=> {
    app.listen(3600, ()=>{
        console.log("Server started on port 3600")
    })

})


