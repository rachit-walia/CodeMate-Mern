import jwt from 'jsonwebtoken';

export const authRequired = async (req,res,next)=>{
  try{
    const token = req.cookies.access;
    if(!token) return res.status(401).json({error:'Unauthorized'});
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  }catch(err){
    return res.status(401).json({error:'Unauthorized'});
  }
};

export const requireRole = role => (req,res,next)=>{
  if(req.user?.role !== role) return res.status(403).json({error:'Forbidden'});
  next();
};
