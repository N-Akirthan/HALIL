package com.halil.api.service;

import com.halil.api.dto.OpeningHoursDTO;
import com.halil.api.model.Client;
import com.halil.api.model.OpeningHours;
import com.halil.api.repository.ClientRepository;
import com.halil.api.repository.OpeningHoursRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpeningHoursService {

    private final ClientRepository clientRepository;
    private final OpeningHoursRepository openingHoursRepository;

    public OpeningHoursService(ClientRepository clientRepository, OpeningHoursRepository openingHoursRepository) {
        this.clientRepository = clientRepository;
        this.openingHoursRepository = openingHoursRepository;
    }

    public List<OpeningHours> updateOpeningHours(Long clientId, List<OpeningHoursDTO> hoursList) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client non trouvé"));

        openingHoursRepository.deleteAll(openingHoursRepository.findByClientId(clientId));

        List<OpeningHours> newHours = hoursList.stream().map(dto -> {
            OpeningHours oh = new OpeningHours();
            oh.setClient(client);
            oh.setDayOfWeek(dto.dayOfWeek());
            oh.setOpenTime(dto.openTime());
            oh.setCloseTime(dto.closeTime());
            return oh;
        }).toList();

        return openingHoursRepository.saveAll(newHours);
    }
}
