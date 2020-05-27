const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("./models/artigo");
const Artigo = mongoose.model('Artigo');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    //console.log("Acessou o Middleware");
    res.header("Access-Control-Allow-Origin", "*"),// onde asterisco e que cosola o site que pode fazer requisição
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");//DEFINE OS METODOS DO CORS PERMITIDOS 
    app.use(cors());
    next();
})

mongoose.connect('mongodb://localhost/PlantView', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("conexão com mongoDB realizada com sucesso!");
}).catch((err) => {
    console.log(" Erro: conexão com mongoDB nao realizada!")
});

app.get("/", (req, res) => {
    //return res.json({titulo: "como criar uma API$$"});

    Artigo.find({}).then((Artigo) => {
        return res.json(Artigo);
    }).catch((erro) => {
        return res.status(400).json({
            error: true,
            message: "Nenhum artigo encontrado"
        })
    })
})

app.get("/artigo/:id", (req, res ) => {
    //console.log(req.params.id);
    //return res.json({id: req.params.id});

    Artigo.findOne({_id:req.params.id}).then((Artigo) => {
        return res.json(Artigo);
    }).catch((erro) => {
        return res.status(400).json({
            error: true,
            message: "Nenhum artigo encontrado!"
        })
    })

    
})


app.post("/artigo", (req, res) => {
    const artigo = Artigo.create(req.body, (err) => {
        if (err) return res.status(400).json({
            error: true,
            message: "Error: Artigo nao foi cadastrado"
        })
            return res.status(200).json({
            error: false,
            message: "Artigo cadastrado com sucesso!"

            });
    });

});

app.put("/artigo/:id", (req, res) => {
    const artigo = Artigo.updateOne({_id:req.params.id}, req.body, (erro) => {
        if(erro) return res.status(400).json({
            error: true,
            message: "Error: Artigo nao foi editado com sucesso!"
        });

        return res.json({
            error: false,
            message: "Arquivo editado com sucesso"
        })
    }) 
});


app.delete("/artigo/:id", (req, res) => {
    const artigo = Artigo.deleteOne({_id:req.params.id}, (erro) => {
        if(erro) return res.status(400).json({
            error: true,
            message: "Error: Artigo nao foi apagado com sucesso!"
        })

        return res.json({
            error: false,
            message: "Artigo apagado com sucesso!"
        })
    });
})


app.listen(8080, () => {
    console.log("servidor iniciado na porta 8080: http://localhost:8080");
});