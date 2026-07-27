package com.mustafayoruk.todolistfullstack.entitys;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "task")
public class Tasks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "header" ,nullable = false)
    private  String header;

    @Column(name = "description" ,nullable = false)
    private  String description;

    @Column(name = "is_finished" ,nullable = false)
    private  Boolean isFinished;

    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    @JsonIgnore
    private Users user;
}
