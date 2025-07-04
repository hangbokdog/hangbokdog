package com.ssafy.hangbokdog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HangbokdogApplication {

	public static void main(String[] args) {
		SpringApplication.run(HangbokdogApplication.class, args);
	}

}
