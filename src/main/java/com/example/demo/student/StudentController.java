package com.example.demo.student;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping(path = "api/v1")
public class StudentController {
    private final StudentService studentService;

    @GetMapping(value = "students")
    public List<Student> getAllStudents() {
        /*List<Student> students = Arrays.asList(
                new Student(1L, "Neha", "neha@gmail.com", Gender.FEMALE),
                new Student(2L, "Gaurav", "gaurav@gmail.com", Gender.MALE)
        );
        return students;*/
        //throw new IllegalStateException("oops error");
        return studentService.getAllStudents();
    }
    @PostMapping(value = "students")
    public void addStudent(@Valid @RequestBody Student student) {
        studentService.addStudent(student);
    }

    @DeleteMapping(path = "student/{studentId}")
    public void deleteStudent(@PathVariable("studentId") Long studentId) {
        studentService.deleteStudent(studentId);
    }
}
