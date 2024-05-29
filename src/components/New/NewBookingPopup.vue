<template>
    <div class="popup-overlay">
      <div class="popup">
        <h2>Book Your Stay</h2>
        <vue-datepicker v-model="selectedDates" :disabled-dates="disabledDates" range></vue-datepicker>
        <div class="buttons">
          <button class="cancel-button" @click="closePopup">Cancel</button>
          <button class="confirm-button" @click="confirmBooking">Confirm</button>
        </div>
      </div>
    </div>
</template>
  
<script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import VueDatepicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css';
  import moment from 'moment'
  //import Notifications from '@kyvg/vue3-notification'
  const API_URL = "http://localhost:5253";
  


  export default {
    name: 'BookingPopup',
    components: { VueDatepicker },
    props: {
      campingSpotId: {
        type: String,
        required: true,
      },
      onClose: {
        type: Function,
        required: true,
      },
    },
  
    setup(props) {
      const selectedDates = ref([]);
      const disabledDates = ref([]);
  
      onMounted(async () => {
        await fetchBookings();
      });
  
      const fetchBookings = async () => {
        try {
            const response = await axios.get(API_URL + `/Booking/Bookings/CampingSpot/${props.campingSpotId}?camping_spot_id=${props.campingSpotId}`);
            const bookings = response.data;
            //console.log('Raw booking dates:', bookings.map(b => ({ start: b.dateStart, end: b.dateEnd })));
  
            let disabledDateList = [];
            bookings.forEach(booking => {
            let currentDate = new Date(booking.dateStart);
            const endDate = new Date(booking.dateEnd);
  
            while (currentDate <= endDate) {
                disabledDateList.push(new Date(currentDate)); 
                currentDate.setDate(currentDate.getDate() + 1); 
            }
            });
  
            disabledDates.value = disabledDateList;
            //console.log('Disabled dates:', disabledDates.value);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        }
    };
  
    const confirmBooking = async () => {
        try {
            let userId;

            try {
            const jwt_value = $cookies.get("jwt");
            const response = await axios.get(API_URL + '/auth/user?jwt_value=' + jwt_value);
            userId = response.data.id;
            } catch (error) {
            console.error('There was an error fetching the user data:', error);
            throw error;
            }
  
            // Convert selected Date to DateTime format required by the API
            let [startDate, endDate] = selectedDates.value;
            startDate = moment(startDate).format('YYYY-MM-DDTHH:mm:ss');
            endDate = moment(endDate).format('YYYY-MM-DDTHH:mm:ss');
  
            //POST booking
            console.log(userId + " and " + props.campingSpotId);
            console.log(typeof startDate);
            console.log(endDate);
  
            const response = await axios.post(API_URL + '/Booking?bookerId=' + userId + '&campingSpotId=' + props.campingSpotId, {
            fK_BookedBy: userId,
            fK_CampingSpot: props.campingSpotId,
            dateStart: startDate + ".000Z",
            dateEnd: endDate + ".000Z",
            });
            if (response.status === 200) {
                props.onClose();
                //this.$notify("Booking Succesful!");
            }
        } catch (error) {
            alert('Please log in or try again later');
            console.error('Failed to confirm booking:', error);
        }
    };
  
  
      const closePopup = () => {
        props.onClose();
      };
  
      return {
        selectedDates,
        disabledDates,
        confirmBooking,
        closePopup,
      };
    },
  };
</script>
  
<style>
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popup {
    background: white;
    padding: 20px;
    border-radius: 10px;
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .cancel-button,
  .confirm-button {
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 20px;
    transition: background-color 0.3s;
  }
  .cancel-button {
    background-color: #ffcccc; 
  }
  .confirm-button {
    background-color: #ccffcc; 
  }
  .cancel-button:hover {
    background-color: #ffb3b3; 
  }
  .confirm-button:hover {
    background-color: #b3ffb3;
  }
</style>
  
  