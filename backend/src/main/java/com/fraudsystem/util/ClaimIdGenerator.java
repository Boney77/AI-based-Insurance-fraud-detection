package com.fraudsystem.util;

import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
public class ClaimIdGenerator {

    private static final AtomicInteger counter = new AtomicInteger(1000);

    public String generate() {
        return "CLM" + counter.incrementAndGet();
    }
}
