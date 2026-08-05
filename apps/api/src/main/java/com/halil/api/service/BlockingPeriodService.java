package com.halil.api.service;

import com.halil.api.model.BlockingPeriod;
import com.halil.api.repository.BlockingPeriodRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BlockingPeriodService {

    private final BlockingPeriodRepository blockingPeriodRepository;

    public BlockingPeriodService(BlockingPeriodRepository blockingPeriodRepository) {
        this.blockingPeriodRepository = blockingPeriodRepository;
    }

    public List<BlockingPeriod> getBlockingPeriodsByClient(Long clientId) {
        return blockingPeriodRepository.findByClientId(clientId);
    }

    public List<BlockingPeriod> getAllBlockingPeriods() {
        return blockingPeriodRepository.findAll();
    }

    public BlockingPeriod createBlockingPeriod(BlockingPeriod blockingPeriod) {
        return blockingPeriodRepository.save(blockingPeriod);
    }

    public BlockingPeriod updateBlockingPeriod(Long id, BlockingPeriod updatedBlockingPeriod) {
        return blockingPeriodRepository.findById(id).map(bp -> {
            bp.setStartDate(updatedBlockingPeriod.getStartDate());
            bp.setEndDate(updatedBlockingPeriod.getEndDate());
            bp.setCause(updatedBlockingPeriod.getCause());
            bp.setClient(updatedBlockingPeriod.getClient());
            return blockingPeriodRepository.save(bp);
        }).orElseThrow(() -> new RuntimeException("Blocking period not found"));
    }

    public void deleteBlockingPeriod(Long id) {
        blockingPeriodRepository.deleteById(id);
    }
}
