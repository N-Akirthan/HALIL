package com.halil.api.controller;

import com.halil.api.model.BlockingPeriod;
import com.halil.api.service.BlockingPeriodService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blocking-periods")
public class BlockingPeriodController {

    private final BlockingPeriodService blockingPeriodService;

    public BlockingPeriodController(BlockingPeriodService blockingPeriodService) {
        this.blockingPeriodService = blockingPeriodService;
    }

    @GetMapping
    public List<BlockingPeriod> getAllBlockingPeriods() {
        return blockingPeriodService.getAllBlockingPeriods();
    }

    @GetMapping("/client/{clientId}")
    public List<BlockingPeriod> getBlockingPeriodsByClient(@PathVariable Long clientId) {
        return blockingPeriodService.getBlockingPeriodsByClient(clientId);
    }

    @PostMapping
    public BlockingPeriod createBlockingPeriod(@RequestBody BlockingPeriod blockingPeriod) {
        return blockingPeriodService.createBlockingPeriod(blockingPeriod);
    }

    @PutMapping("/{id}")
    public BlockingPeriod updateBlockingPeriod(@PathVariable Long id, @RequestBody BlockingPeriod blockingPeriod) {
        return blockingPeriodService.updateBlockingPeriod(id, blockingPeriod);
    }

    @DeleteMapping("/{id}")
    public void deleteBlockingPeriod(@PathVariable Long id) {
        blockingPeriodService.deleteBlockingPeriod(id);
    }
}
