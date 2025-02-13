    package com.vlotech.javabackend.service;

    import com.vlotech.javabackend.model.Address;
    import com.vlotech.javabackend.model.User;
    import com.vlotech.javabackend.repository.AddressRepository;
    import com.vlotech.javabackend.repository.UserRepository;
    import jakarta.transaction.Transactional;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.stereotype.Service;

    import java.util.List;
    import java.util.Optional;

    @Service
    public class AddressService {

        private final AddressRepository addressRepository;
        private final UserRepository userRepository;

        public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
            this.addressRepository = addressRepository;
            this.userRepository = userRepository;
        }


        @Transactional
        public void setPrimaryAddress(String userId, Long addressId) {
            List<Address> userAddresses = addressRepository.findByUserId(userId);

            for (Address address : userAddresses) {
                address.setPrimary(address.getId().equals(addressId));
            }

            addressRepository.saveAll(userAddresses);
        }

        @Transactional
        public Address addAddress(String userId, Address address) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            address.setUser(user);
            return addressRepository.save(address);
        }

        @Transactional
        public Address updateAddress(Address address) {
            Optional<Address> existingAddress = addressRepository.findById(address.getId());
            if (existingAddress.isPresent()) {
                Address updatedAddress = existingAddress.get();
                updatedAddress.setStreet(address.getStreet());
                updatedAddress.setStreetNumber(address.getStreetNumber());
                updatedAddress.setFlat(address.getFlat());
                updatedAddress.setCity(address.getCity());
                updatedAddress.setState(address.getState());
                updatedAddress.setZipCode(address.getZipCode());
                updatedAddress.setCountry(address.getCountry());
                updatedAddress.setPrimary(address.isPrimary());
                return addressRepository.save(updatedAddress);
            } else {
                return null;
            }
        }
        @Transactional
        public List<Address> getAllAddresses() {
            return addressRepository.findAll();
        }

        @Transactional
        public boolean deleteAddress(Long addressId) {
            if (addressRepository.existsById(addressId)) {
                addressRepository.deleteById(addressId);
                return true;
            }
            return false;
        }

        @Transactional
        public Address updateAddress(Long addressId, Address updatedAddress) {
            Optional<Address> existingAddressOpt = addressRepository.findById(addressId);
            if (existingAddressOpt.isPresent()) {
                Address existingAddress = existingAddressOpt.get();
                existingAddress.setStreet(updatedAddress.getStreet());
                existingAddress.setStreetNumber(updatedAddress.getStreetNumber());
                existingAddress.setFlat(updatedAddress.getFlat());
                existingAddress.setCity(updatedAddress.getCity());
                existingAddress.setState(updatedAddress.getState());
                existingAddress.setZipCode(updatedAddress.getZipCode());
                existingAddress.setCountry(updatedAddress.getCountry());
                existingAddress.setPrimary(updatedAddress.isPrimary());
                return addressRepository.save(existingAddress);
            }
            return null;
        }
    }