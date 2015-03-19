#include "mbed.h"
#include "main.h"
#include "sx1276-hal.h"
#include "debug.h"

/* Set this flag to '1' to display debug messages on the console */
#define DEBUG_MESSAGE   1

/* Set this flag to '1' to use the LoRa modulation or to '0' to use FSK modulation */
#define USE_MODEM_LORA  1
#define USE_MODEM_FSK   !USE_MODEM_LORA

#define RF_FREQUENCY                                    868500000 // Hz
#define TX_OUTPUT_POWER                                 14        // 14 dBm

#if USE_MODEM_LORA == 1

    #define LORA_BANDWIDTH                              0         // [0: 125 kHz,
                                                                  //  1: 250 kHz,
                                                                  //  2: 500 kHz,
                                                                  //  3: Reserved]
    #define LORA_SPREADING_FACTOR                       12         // [SF7..SF12]
    #define LORA_CODINGRATE                             1         // [1: 4/5,
                                                                  //  2: 4/6,
                                                                  //  3: 4/7,
                                                                  //  4: 4/8]
    #define LORA_PREAMBLE_LENGTH                        8         // Same for Tx and Rx
    #define LORA_SYMBOL_TIMEOUT                         5         // Symbols
    #define LORA_FIX_LENGTH_PAYLOAD_ON                  false
    #define LORA_FHSS_ENABLED                           false  
    #define LORA_NB_SYMB_HOP                            4     
    #define LORA_IQ_INVERSION_ON                        false
    #define LORA_CRC_ENABLED                            true
    
#elif USE_MODEM_FSK == 1

    #define FSK_FDEV                                    25000     // Hz
    #define FSK_DATARATE                                19200     // bps
    #define FSK_BANDWIDTH                               50000     // Hz
    #define FSK_AFC_BANDWIDTH                           83333     // Hz
    #define FSK_PREAMBLE_LENGTH                         5         // Same for Tx and Rx
    #define FSK_FIX_LENGTH_PAYLOAD_ON                   false
    #define FSK_CRC_ENABLED                             true
    
#else
    #error "Please define a modem in the compiler options."
#endif

#define TX_TIMEOUT_VALUE                                5000000   // in us
#define BUFFER_SIZE                                     21        // Define the payload size here

#if( defined ( TARGET_KL25Z ) || defined ( TARGET_LPC11U6X ) )
DigitalOut led(LED2);
#else
DigitalOut led(LED1);
#endif

/*
 *  Global variables declarations
 */
typedef RadioState States_t;
volatile States_t State = LOWPOWER;

SX1276MB1xAS Radio( OnTxDone, OnTxTimeout, NULL, NULL, NULL, NULL, NULL );


uint16_t BufferSize = BUFFER_SIZE;
uint8_t Buffer[BUFFER_SIZE];

int16_t RssiValue = 0.0;
int8_t SnrValue = 0.0;

int main() 
{
    uint8_t i;
    
    debug( "\n\n\rSX1276 SMARTCAMPUS TX\n\n\r" );
    
    // verify the connection with the board
    while( Radio.Read( REG_VERSION ) == 0x00  )
    {
        debug( "Radio could not be detected!\n\r", NULL );
        wait( 1 );
    }
            
    debug_if( ( DEBUG_MESSAGE & ( Radio.DetectBoardType( ) == SX1276MB1LAS ) ) , "\n\r > Board Type: SX1276MB1LAS < \n\r" );
    debug_if( ( DEBUG_MESSAGE & ( Radio.DetectBoardType( ) == SX1276MB1MAS ) ) , "\n\r > Board Type: SX1276MB1MAS < \n\r" );
    
    Radio.SetChannel( RF_FREQUENCY ); 

#if USE_MODEM_LORA == 1
    
    debug_if( LORA_FHSS_ENABLED, "\n\n\r             > LORA FHSS Mode < \n\n\r");
    debug_if( !LORA_FHSS_ENABLED, "\n\n\r             > LORA Mode < \n\n\r");

    Radio.SetTxConfig( MODEM_LORA, TX_OUTPUT_POWER, 0, LORA_BANDWIDTH,
                         LORA_SPREADING_FACTOR, LORA_CODINGRATE,
                         LORA_PREAMBLE_LENGTH, LORA_FIX_LENGTH_PAYLOAD_ON,
                         LORA_CRC_ENABLED, LORA_FHSS_ENABLED, LORA_NB_SYMB_HOP, 
                         LORA_IQ_INVERSION_ON, 2000000 );
    
    Radio.SetRxConfig( MODEM_LORA, LORA_BANDWIDTH, LORA_SPREADING_FACTOR,
                         LORA_CODINGRATE, 0, LORA_PREAMBLE_LENGTH,
                         LORA_SYMBOL_TIMEOUT, LORA_FIX_LENGTH_PAYLOAD_ON, 0,
                         LORA_CRC_ENABLED, LORA_FHSS_ENABLED, LORA_NB_SYMB_HOP, 
                         LORA_IQ_INVERSION_ON, true );
                         
#elif USE_MODEM_FSK == 1

    debug("\n\n\r              > FSK Mode < \n\n\r");
    Radio.SetTxConfig( MODEM_FSK, TX_OUTPUT_POWER, FSK_FDEV, 0,
                         FSK_DATARATE, 0,
                         FSK_PREAMBLE_LENGTH, FSK_FIX_LENGTH_PAYLOAD_ON,
                         FSK_CRC_ENABLED, 0, 0, 0, 2000000 );
    
    Radio.SetRxConfig( MODEM_FSK, FSK_BANDWIDTH, FSK_DATARATE,
                         0, FSK_AFC_BANDWIDTH, FSK_PREAMBLE_LENGTH,
                         0, FSK_FIX_LENGTH_PAYLOAD_ON, 0, FSK_CRC_ENABLED,
                         0, 0, false, true );
                         
#else

#error "Please define a modem in the compiler options."

#endif
     
    debug_if( DEBUG_MESSAGE, "Starting JejeLaVedette loop\r\n" ); 
        
    led = 0;
        
    Radio.Tx( TX_TIMEOUT_VALUE );


    while(1){
        switch( State )
        {
         case TX:
            if( BufferSize > 0 )
                {
                    led = !led; 
                    debug("Sending a packet\r\n");
                    
                    // Setting data
                    uint8_t id = rand() % 6 + 1;
                    int windDirection = rand() % 360 + 1;
                    int humidity = rand() % 10 + 50;
                    long temperature = rand() % 4 + 22;
                    float windSpeed = static_cast <float> (rand()) / (static_cast <float> (RAND_MAX/10));
                    float water = (static_cast <float> (rand()) / (static_cast <float> (RAND_MAX/40))) + 60;
                    float battery = 100.0f;
                    float pressure = (static_cast <float> (rand()) / (static_cast <float> (RAND_MAX/50))) + 1000;
                    
                    // Convertion to uint8_t and packaging
                    
                    // ID
                    Buffer[0] = id;
                        
                    // Wind direction    
                    union{
                        uint16_t i;
                        struct{
                            uint8_t v0, v1;
                        } bytes;
                    } windToSend;
                    
                    uint16_t windDir16 = (uint16_t) windDirection;
                    
                    windToSend.i = windDir16;
                    
                    Buffer[1] = windToSend.bytes.v0;
                    Buffer[2] = windToSend.bytes.v1;
                    
                    // Humidity
                    Buffer[3] = (uint8_t) humidity;
                    
                    // Temperature
                    int8_t tempConv = (int8_t) temperature;
                    uint8_t tempToSend = (uint8_t) tempConv;
                    Buffer[4] = tempToSend;
                    
                    // Wind speed
                    
                    // Struct for float convertion
                    union{
                        float f;
                        struct{
                            uint8_t v0, v1, v2, v3;
                        } bytes;
                    } floatConvertion;
                    
                    floatConvertion.f = windSpeed;
                    Buffer[5] = floatConvertion.bytes.v0;
                    Buffer[6] = floatConvertion.bytes.v1;
                    Buffer[7] = floatConvertion.bytes.v2;
                    Buffer[8] = floatConvertion.bytes.v3;
                    
                    // Water
                    // Convertion
                    floatConvertion.f = water * 25.4f;
                    Buffer[9] = floatConvertion.bytes.v0;
                    Buffer[10] = floatConvertion.bytes.v1;
                    Buffer[11] = floatConvertion.bytes.v2;
                    Buffer[12] = floatConvertion.bytes.v3;
                    
                    // Battery
                    floatConvertion.f = battery;
                    Buffer[13] = floatConvertion.bytes.v0;
                    Buffer[14] = floatConvertion.bytes.v1;
                    Buffer[15] = floatConvertion.bytes.v2;
                    Buffer[16] = floatConvertion.bytes.v3;
                    
                    // Pressure
                    floatConvertion.f = pressure;
                    Buffer[17] = floatConvertion.bytes.v0;
                    Buffer[18] = floatConvertion.bytes.v1;
                    Buffer[19] = floatConvertion.bytes.v2;
                    Buffer[20] = floatConvertion.bytes.v3;
                    
                    // We fill the buffer with numbers for the payload 
                    for( i = BufferSize; i < BufferSize; i++ )
                    {
                        Buffer[i] = i - BufferSize;
                    }
                    wait_ms( 10 );  
                    //Radio.getRSSI();
                    Radio.Send( Buffer, BufferSize );
                }
        case TX_TIMEOUT:
            Radio.Tx( TX_TIMEOUT_VALUE );
            State = LOWPOWER;
            break;
        case LOWPOWER:
            break;
        default:
            State = LOWPOWER;
            break;
        }    
    }    
}

void OnTxDone( void )
{
    Radio.Sleep( );
    wait_ms(5000);
    State = TX;
    debug_if( DEBUG_MESSAGE, "> OnTxDone\n\r" );
}

void OnRxDone( uint8_t *payload, uint16_t size, int16_t rssi, int8_t snr)
{
    Radio.Sleep( );
    BufferSize = size;
    memcpy( Buffer, payload, BufferSize );
    RssiValue = rssi;
    SnrValue = snr;
    State = RX;
    debug_if( DEBUG_MESSAGE, "> OnRxDone\n\r" );
}

void OnTxTimeout( void )
{
    Radio.Sleep( );
    State = TX_TIMEOUT;
    debug_if( DEBUG_MESSAGE, "> OnTxTimeout\n\r" );
}

void OnRxTimeout( void )
{
    Radio.Sleep();
    Buffer[ BufferSize ] = 0;
    State = RX_TIMEOUT;
    debug_if( DEBUG_MESSAGE, "> OnRxTimeout\n\r" );
}

void OnRxError( void )
{
    Radio.Sleep( );
    State = RX_ERROR;
    debug_if( DEBUG_MESSAGE, "> OnRxError\n\r" );
}

