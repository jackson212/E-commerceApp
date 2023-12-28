class  ApiFeatures{
  
  constructor(query,querystr){
  
    this.query=query;
    this.querystr=querystr
      
  }
  
search(){
     
    const keyword =this.querystr.keyword?{
         name:{
            $regex:this.querystr.keyword,
            $options:"i",
  
        },
    }:{}
  
    console.log(keyword)
    this.query=this.query.find({...keyword})
    return this;
  
}
  
filter(){
  
   const quercopy={...this.querystr}
  
  
   const removeFields=['keyword','page','limit']
   removeFields.forEach((key)=> delete quercopy[key])
    
  
   
   let queryStr = JSON.stringify(quercopy);

   queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

   console.log(queryStr)

   this.query = this.query.find(JSON.parse(queryStr));
    

   return this;
  
 
 }


 pagination(resultpage){

       
  const currentpage=Number(this.querystr.page)||1
  const skip=resultpage*(currentpage-1);

  
  this.query=this.query.limit(resultpage).skip(skip);

  return this;

}


} 
  
module.exports=ApiFeatures


