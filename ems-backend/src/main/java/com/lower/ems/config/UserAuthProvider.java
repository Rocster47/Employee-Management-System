package com.lower.ems.config;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.lower.ems.dto.EmployeeDto;
import com.lower.ems.dto.EmployerDto;
import com.lower.ems.exception.AppException;
import com.lower.ems.mapper.EmployeeMapper;
import com.lower.ems.mapper.EmployerMapper;
import com.lower.ems.service.EmployeeService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@RequiredArgsConstructor
@Component
public class UserAuthProvider {

    @Value("${security.jwt.token.secret-key:secret-key}")
    private String secretKey;

    private final EmployeeService employeeService;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createToken(String login, Long id, String firstName, String lastName, String employerName, String role) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + 3600000); // 1 hour

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(login)
                .withIssuedAt(now)
                .withExpiresAt(validity)
                .withClaim("id", id)
                .withClaim("firstName", firstName)
                .withClaim("lastName", lastName)
                .withClaim("employerName", employerName)
                .withClaim("role", role)
                .sign(algorithm);
    }

    public Authentication validateToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm)
                .build();

        DecodedJWT decoded = verifier.verify(token);

        String role = decoded.getClaim("role").asString();
        List<GrantedAuthority> authorities = role != null
                ? List.of(new SimpleGrantedAuthority("ROLE_" + role))
                : List.of();

        if (employeeService.existsEmployee(decoded.getSubject())) {
            EmployeeDto employee = EmployeeMapper.mapToEmployeeDto(employeeService.findEmployeeByEmail(decoded.getSubject()));
            return new UsernamePasswordAuthenticationToken(employee, null, authorities);
        } else if (employeeService.existsEmployer(decoded.getSubject())) {
            EmployerDto employer = EmployerMapper.mapToEmployerDto(employeeService.findEmployerByEmail(decoded.getSubject()));
            return new UsernamePasswordAuthenticationToken(employer, null, authorities);
        } else {
            throw new AppException("Unknown user", HttpStatus.NOT_FOUND);
        }
    }

    public Instant getExpiration(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        DecodedJWT decodedJWT = JWT.require(algorithm)
                .build()
                .verify(token);

        Date expiration = decodedJWT.getExpiresAt();
        return expiration.toInstant();
    }

    public Long getUserId(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        DecodedJWT decodedJWT = JWT.require(algorithm)
                .build()
                .verify(token);

        return decodedJWT.getClaim("id").asLong();
    }

    public String getRole(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        DecodedJWT decodedJWT = JWT.require(algorithm)
                .build()
                .verify(token);

        return decodedJWT.getClaim("role").asString();
    }
}