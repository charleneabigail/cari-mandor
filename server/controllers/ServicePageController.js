const db = require("../db");

class ServicePageController {
  // 1. MENAMPILKAN LIST SERVICE SAYA
  static async showListServices(req, res) {
    try {
      const myServices = await db("services").select("*").where({id_seller: req.session.user.id});
      console.log(myServices, "=======> myServices");
      // return res.status(200).json(dataServices); //return bisa dihapus karena langsung respon
      res.render('showMyServicePage', { myServices });
    } catch (error) {
        res.render('showMyServicePage', {
          isSuccess: false,
          message : 'Internal server error'})
        //res.status(500).json(error);
    }
  }


  // 2. MENAMPILKAN HALAMAN ADD SERVICE
  // Menampilkan form untuk input servicenya
  static showAddServicePage(req, res) {
    res.render("addServiceFormPage");
  }

  // Menampilkan pesan apakah inputnya berhasil / gagal
  static async addServicePage(req, res) {
    try {
      const id_seller = req.session.user.id;
      const {
        // id_seller, 
        title, description, status, category, sub_category, price, photo, link_portofolio} = req.body;

      const inputUser = {
        id_seller,
        title,
        description,
        status,
        category,
        sub_category,
        price,
        photo,
        link_portofolio,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // const findUser = await db("user").where({ id: id_seller });  =======> TIDAK PERLU LAGI KARENA SUDAH DIHANDLE SESSION
      // if (!findUser.length) {
      //   return res.render("addServiceResultPage", {
      //     isSuccess: false,
      //     message: "User tidak ditemukan",
      //   });
      // }

      await db("services").insert(inputUser).returning("*");
      return res.render("addServiceResultPage", {
        isSuccess: true,
        message: "Service berhasil ditambahkan.",
      });
    } catch (error) {
      console.log(error);
      console.log(error);
      return res.render("addServiceResultPage", {
        isSuccess: false,
        message: "Internal server error.",
      });
    }
  }

  // 3. MENAMPILKAN HALAMAN UPDATE SERVICE
  // Menampilkan form untuk input servicenya
  static showUpdateServicePage(req, res) {
    const id = req.params.id;
    console.log(id, '========> ini id')
    res.render('updateServiceFormPage', { id });
  }

  // Menampilkan pesan apakah inputnya berhasil / gagal
  static async updateServicePage(req, res) {
      try {
          const id = req.params.id;
          const {
            // id_seller, 
            title, description, status, category, sub_category, price, photo, link_portofolio} = req.body;

            console.log(req.body,'======> reqbody');
          const inputUser = {
              // id_seller,
              title,
              description,
              status,
              category,
              sub_category,
              price,
              photo,
              link_portofolio,
              updated_at : new Date(),
          }

          console.log(inputUser);

          const findService = await db('services').select('*').where({id: id, id_seller: req.session.user.id});
          if (!findService.length) {
              return res.render ('updateServiceResultPage', {
                isSuccess : false,
                message : 'Data tidak ditemukan'
            })
          }

          const updateService = await db('services').update(inputUser).where({id : id}).returning('*');
          console.log(updateService);
          return res.render ('updateServiceResultPage', {
            isSuccess : true,
            message : 'Update service berhasil'
          })
         
      } catch (error) {
        console.log(error, '=======> ini eror');
           res.render ('updateServiceResultPage', {
            isSuccess : false,
            message : 'Internal server error'
           })   
      }
  }

  // 4. MENAMPILKAN HALAMAN DELETE SERVICE
  // Menampilkan pesan apakah inputnya berhasil / gagal
  static async deleteServicePage(req, res) {
      try {
          let id = req.params.id;
          let id_seller = req.session.user.id

          // const findUser = await db('services').select('*').where({id : id, id_seller : id_seller}); ===> SUDAH DIHANDLE SESSION
          // if (!findUser.length) {
          //     return res.render ('deleteServiceResultPage', {
          //       isSuccess : false,
          //       message : 'Data tidak ditemukan'
          //     })
          // }

          const data = await db('services').del(id).where({id: id, id_seller : id_seller}).returning('id')
          return res.render ('deleteServiceResultPage', {
            isSuccess : true,
            message : `Delete service dengan id ${id} berhasil!`
          })
          
      } catch (error) {
          res.render('deleteServiceResultPage', {
            isSuccess : false,
            message : 'Internal server error'
          })
      }
  }


  
}

module.exports = ServicePageController;