import mongoose from 'mongoose'

const schema = mongoose.Schema;

let userSchema = new schema({
    name:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        required: true,
        dropDups: true,
        trim: true,
        unique:true,
        index:true
    },
    password:
    {
        type: String,
        required: true
    }
},{
    timestamps: true,
    collection: 'user'
})

const User = mongoose.model('User',userSchema);
export default User;