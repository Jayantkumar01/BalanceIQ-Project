package com.balanceiq.burnout.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.balanceiq.burnout.dto.BurnoutResponse;
import com.balanceiq.burnout.service.BurnoutService;

@RestController
@RequestMapping("/burnout")
public class BurnoutController {

    @Autowired
    private BurnoutService burnoutService;

    @PostMapping("/calculate/{employeeId}")
    public BurnoutResponse calculateBurnout(
            @PathVariable Long employeeId) {

        return burnoutService.assessBurnout(employeeId);
    }
}