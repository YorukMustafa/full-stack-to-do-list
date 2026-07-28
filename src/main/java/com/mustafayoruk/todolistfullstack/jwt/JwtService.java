package com.mustafayoruk.todolistfullstack.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET_KEY = "Uy9uABa63lWt2sSvqJjqc9qfBV2qfKIFedRRddyoFl2Uy9uABa63lWt2sSvqJjqc9qfBV2qfKIFedRRddyoFl2"; // HS256 için en az 256 bit olmalı

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claimsMap = new HashMap<>();
        claimsMap.put("Role", "User");

        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .addClaims(claimsMap)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + (1000 * 60 * 60 * 2)))
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims getClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Object getRolesByClaims(String token, String key){
        Claims claims = getClaims(token);
        return claims.get(key);
    }

    public <T> T exportToken(String token, Function<Claims, T> claimsFunction) {
        Claims claims = getClaims(token);
        return claimsFunction.apply(claims);
    }

    public String getUsernameByToken(String token){
        return exportToken(token, Claims::getSubject);
    }

    public boolean isTokenExpired(String token){
        Date expiredDate = exportToken(token, Claims::getExpiration);
        return new Date().after(expiredDate);
    }

    public Key getKey(){
        // Base64 hatası almamak için doğrudan UTF-8 byte dizisine çeviriyoruz
        byte[] keyBytes = SECRET_KEY.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}