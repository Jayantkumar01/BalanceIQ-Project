package com.balanceiq.burnout.service;

import com.balanceiq.burnout.dto.BurnoutResponse;

public interface BurnoutService {

    BurnoutResponse assessBurnout(Long employeeId);
}