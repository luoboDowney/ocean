package cn.b504.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
class HelloWorldController {
  @RequestMapping("/hello")
  public  String hello(Model model){
    model.addAttribute("greeting","Hello Spring MVC");
    return "helloworld";
  }

}