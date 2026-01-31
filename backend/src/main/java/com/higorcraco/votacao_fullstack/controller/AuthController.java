package com.higorcraco.votacao_fullstack.controller;

import com.higorcraco.votacao_fullstack.dto.LoginRequestDto;
import com.higorcraco.votacao_fullstack.dto.UsuarioDto;
import com.higorcraco.votacao_fullstack.dto.converter.UsuarioDtoConverter;
import com.higorcraco.votacao_fullstack.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService service;
    private final UsuarioDtoConverter dtoConverter;

    @PostMapping("/login")
    public ResponseEntity<UsuarioDto> login(@RequestBody LoginRequestDto loginRequest) {
        UsuarioDto dto = dtoConverter.from(service.login(loginRequest));

        return ResponseEntity.ok(dto);
    }
}
