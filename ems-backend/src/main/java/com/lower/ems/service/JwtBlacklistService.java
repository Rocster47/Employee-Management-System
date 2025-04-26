package com.lower.ems.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class JwtBlacklistService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Autowired
    public JwtBlacklistService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void blacklistToken(String jti, long expirationInMillis) {
        redisTemplate.opsForValue().set(
                "blacklist:" + jti,
                true,
                expirationInMillis,
                TimeUnit.MILLISECONDS
        );
    }

    public boolean isTokenBlacklisted(String jti) {
        return redisTemplate.hasKey("blacklist:" + jti);
    }
}
