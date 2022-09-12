const express = require('express');
const router = express.Router();
const Company = require("../models/company")
const jwt = require("jsonwebtoken")
const authenticate = require('../config/auth.json')
const mongoose = require('mongoose')

//Rota que obtem todas as empresas cadastradas na nossa plataforma
router.get("/getAllCompany", async(req,res)=>{
    console.log("rodando.....")
    try{
        const companies = await Company.find()
        console.log(companies)
        return res.send(companies)
    }
    catch(err){
        return res.status(400).send({error:"Error loading companies"})
    }
})

//rota utilizada para a criação de empresas
router.post('/createCompany', async (req,res)=>{
   
    try{
        const {nome_Empresa,
            email_Empresa,
            valor_Empresa,
            descricao_Empresa,
            user_Type} = req.body;
        const companies = await new Company({
            nome_Empresa,
            email_Empresa,
            valor_Empresa,
            descricao_Empresa,
            user_Type})

        companies.save()
        const token = jwt.sign({id:companies.id}, authenticate.secret,{expiresIn:86400})
    return res.send({"empresa":companies, "token":token},200)   
} catch(err){
        return res.status(400).send({error: 'Error creating new company'})
}
})

//ROTA de Obtenção de uma unica empresa
router.get("/:id", async(req,res)=>{
    //const result = mongoose.Types.ObjectId.isValid(req.param.id);
    //console.log("resultado aqui",result)
    //if(result == true)
    //    return res.send({"msg":"Bad Request the Id is not in the right type"},400)
    try{
    //console.log(result)
    const companies = await Company.findById(req.params.id)
    console.log(companies)
    if(!companies)
        return res.status(400).send({error:'Company not founded'})
    return res.send(companies)
    }
    catch(err){
        return res.send({"msg":"Server Error"},500)
    }
    //return res.send({"msg":"Error Server "},500) 
    //}
})


module.exports = router;