const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Reviews = require("./review.js");

const listingSchema = new Schema({
     title:{
          type: String,
          //required: true,
     },
     description: String,
     // image :{
     //  type:String,
     //  default:
     //      "https://images.unsplash.com/photo-1761839258803-21515f43190c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
     //  set:(v)=> v ===""?"https://images.unsplash.com/photo-1761839258803-21515f43190c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
     //  :v,

     // },

      image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1761839258803-21515f43190c?q=80&w=1170&auto=format&fit=crop",
    },
  },
     price:Number,
     location: String,
     country:String,
     reviews:[
          {
               type: Schema.Types.ObjectId,
               ref: "Review",
          }
     ],
});

listingSchema.post("findOneAndDelete", async (listing)=>{
     if(listing){
     await Reviews.deleteMany({_id: {$in: listing.reviews}});

     }
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
