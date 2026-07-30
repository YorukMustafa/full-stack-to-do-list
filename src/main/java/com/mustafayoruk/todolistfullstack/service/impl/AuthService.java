package com.mustafayoruk.todolistfullstack.service.impl;

import com.mustafayoruk.todolistfullstack.dto.DtoUsers;
import com.mustafayoruk.todolistfullstack.entitys.Roles;
import com.mustafayoruk.todolistfullstack.entitys.Users;
import com.mustafayoruk.todolistfullstack.jwt.AuthRequest;
import com.mustafayoruk.todolistfullstack.jwt.AuthResponse;
import com.mustafayoruk.todolistfullstack.jwt.JwtService;
import com.mustafayoruk.todolistfullstack.mapper.UserMapper;
import com.mustafayoruk.todolistfullstack.repositorys.IRolesRepository;
import com.mustafayoruk.todolistfullstack.repositorys.IUsersRepositorys;
import com.mustafayoruk.todolistfullstack.service.IAuthService;
import com.mustafayoruk.todolistfullstack.service.ITasksService;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements IAuthService {

    private final IUsersRepositorys iUsersRepository;
    private final IRolesRepository iRolesRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationProvider authenticationProvider;
    private final JwtService jwtService;
    private final ITasksService iTasksService;

    public AuthService(IUsersRepositorys iUsersRepository,
                       IRolesRepository iRolesRepository,
                       BCryptPasswordEncoder bCryptPasswordEncoder,
                       UserMapper userMapper,
                       AuthenticationProvider authenticationProvider,
                       JwtService jwtService,
                       ITasksService iTasksService) {
        this.iUsersRepository = iUsersRepository;
        this.iRolesRepository = iRolesRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.userMapper = userMapper;
        this.authenticationProvider = authenticationProvider;
        this.jwtService = jwtService;
        this.iTasksService = iTasksService;
    }

    @Override
    public DtoUsers register(AuthRequest request) {
        if (iUsersRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanılıyor!");
        }
        if (request.getEmail() != null && !request.getEmail().isBlank() && iUsersRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanılıyor!");
        }

        Users user = userMapper.requestToEntity(request);
        user.setPassword(bCryptPasswordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());

        try {
            Roles role = iRolesRepository.findByName("USER")
                    .orElseGet(() -> iRolesRepository.findByName("ROLE_USER")
                            .orElseGet(() -> iRolesRepository.findById(1L)
                                    .orElseGet(() -> {
                                        Roles defaultRole = new Roles();
                                        defaultRole.setName("USER");
                                        return iRolesRepository.save(defaultRole);
                                    })));
            user.setRole(role);
        } catch (Exception e) {
            System.err.println("Role assignment failed: " + e.getMessage());
        }

        Users savedUser = iUsersRepository.save(user);

        return userMapper.entityToDto(savedUser);
    }

    @Override
    public AuthResponse authenticate(AuthRequest request) {
        Authentication authentication = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String accessToken = jwtService.generateToken(userDetails);

        return new AuthResponse(accessToken);
    }
}