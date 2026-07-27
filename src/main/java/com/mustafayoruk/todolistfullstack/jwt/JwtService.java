package com.mustafayoruk.todolistfullstack.jwt;

import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {
    private  static final String SECRET_KEY="";

    public String genareteToken(UserDetails userDetails){
            Map<String,Object> newMap=new HashMap<>();
            newMap.put("Role","User");
        return Jwts.builder()
                .setSubject()
                .addClaims()
                .setIssuedAt()
                .setExpiration()
                .signWith()
                .compact()




    }

    public String exportToken(){
return null;

    }
    public  String getUsernameByToken(){
return null;
    }
    public  boolean isTokenExpired(){
return false;
    }
    public  String getSecretKey(){

return null;
    }
}
