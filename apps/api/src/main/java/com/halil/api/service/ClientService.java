package com.halil.api.service;

import com.halil.api.model.Client;
import com.halil.api.repository.ClientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    public Client createClient(Client client) {
        return clientRepository.save(client);
    }

    public void deleteClientById(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Client with id " + id + " not found.");
        }
        clientRepository.deleteById(id);
    }

    public Client updateClient(Long id, Client updatedClient) {
        return clientRepository.findById(id).map(existingClient -> {
            existingClient.setName(updatedClient.getName());
            existingClient.setEmail(updatedClient.getEmail());
            existingClient.setPhone(updatedClient.getPhone());
            existingClient.setPhone2(updatedClient.getPhone2());
            existingClient.setLandline_phone(updatedClient.getLandline_phone());
            existingClient.setAddress(updatedClient.getAddress());
            existingClient.setManager(updatedClient.getManager());
            existingClient.setMain_contact(updatedClient.getMain_contact());
            existingClient.setAccountant(updatedClient.getAccountant());
            existingClient.setAccountant_phone(updatedClient.getAccountant_phone());
            existingClient.setCommercial(updatedClient.getCommercial());
            existingClient.setNote(updatedClient.getNote());
            existingClient.setOpen(updatedClient.isOpen());
            existingClient.setColor(updatedClient.getColor());
            return clientRepository.save(existingClient);
        }).orElseThrow(() -> new RuntimeException("Cannot found the client with this id : " + id));
    }

    public List<Client> searchClientsByName(String query) {
        return clientRepository.findByNameContainingIgnoreCase(query);
    }
}
