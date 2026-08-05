package com.halil.api.repository;

import com.halil.api.model.BlockingPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlockingPeriodRepository extends JpaRepository<BlockingPeriod, Long> {
    List<BlockingPeriod> findByClientId(Long clientId);
}
