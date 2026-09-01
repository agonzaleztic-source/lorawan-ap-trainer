/* Tablas de la seccion de referencia rapida. */
export const T_DR_EU = [
  ["DR0", "SF12", "125 kHz", "250 bit/s", "51 B"],
  ["DR1", "SF11", "125 kHz", "440 bit/s", "51 B"],
  ["DR2", "SF10", "125 kHz", "980 bit/s", "51 B"],
  ["DR3", "SF9", "125 kHz", "1.760 bit/s", "115 B"],
  ["DR4", "SF8", "125 kHz", "3.125 bit/s", "242 B"],
  ["DR5", "SF7", "125 kHz", "5.470 bit/s", "242 B"],
  ["DR6", "SF7", "250 kHz", "11.000 bit/s", "242 B"],
  ["DR7", "FSK", "—", "50.000 bit/s", "242 B"],
];
export const T_MTYPE = [
  ["000", "Join-Request", "Uplink"],
  ["001", "Join-Accept", "Downlink"],
  ["010", "Unconfirmed Data Up", "Uplink"],
  ["011", "Unconfirmed Data Down", "Downlink"],
  ["100", "Confirmed Data Up", "Uplink"],
  ["101", "Confirmed Data Down", "Downlink"],
  ["110", "Rejoin-Request (1.1)", "Uplink"],
  ["111", "Proprietary", "—"],
];
export const T_CID = [
  ["0x02", "LinkCheck", "Nodo", "Margen de enlace y número de gateways"],
  ["0x03", "LinkADR", "Servidor", "DR, potencia, máscara de canales, NbTrans"],
  ["0x04", "DutyCycle", "Servidor", "Límite agregado de ciclo de trabajo"],
  ["0x05", "RXParamSetup", "Servidor", "RX1DROffset y parámetros de RX2"],
  ["0x06", "DevStatus", "Servidor", "Batería y margen SNR del nodo"],
  ["0x07", "NewChannel", "Servidor", "Alta o baja de canal de uplink"],
  ["0x08", "RXTimingSetup", "Servidor", "Retardo de RX1"],
  ["0x09", "TxParamSetup", "Servidor", "EIRP máxima y dwell time"],
  ["0x0A", "DlChannel", "Servidor", "Frecuencia de downlink de un canal"],
  ["0x0B", "Rekey (1.1)", "Nodo", "Confirmación de cambio de claves"],
  ["0x0C", "ADRParamSetup (1.1)", "Servidor", "ADR_ACK_LIMIT y ADR_ACK_DELAY"],
  ["0x0D", "DeviceTime", "Nodo", "Hora de red referida a GPS"],
  ["0x0E", "ForceRejoin (1.1)", "Servidor", "Fuerza un Rejoin-Request"],
  ["0x0F", "RejoinParamSetup (1.1)", "Servidor", "Periodicidad de rejoin"],
  ["0x10", "PingSlotInfo", "Nodo", "Periodicidad de ping slot (clase B)"],
  ["0x11", "PingSlotChannel", "Servidor", "Frecuencia y DR de los ping slots"],
  ["0x13", "BeaconFreq", "Servidor", "Frecuencia de baliza"],
];
export const T_KEYS = [
  ["AppKey", "1.0.x y 1.1", "Raíz", "Deriva claves de sesión (1.0.x) o solo la AppSKey (1.1)"],
  ["NwkKey", "1.1", "Raíz", "Deriva las tres claves de sesión de red"],
  ["NwkSKey", "1.0.x", "Sesión", "MIC de las tramas y cifrado de comandos MAC"],
  ["AppSKey", "1.0.x y 1.1", "Sesión", "Cifra el FRMPayload de aplicación"],
  ["FNwkSIntKey", "1.1", "Sesión", "Media parte del MIC de uplink (forwarding NS)"],
  ["SNwkSIntKey", "1.1", "Sesión", "Media parte del MIC de uplink y MIC de downlink"],
  ["NwkSEncKey", "1.1", "Sesión", "Cifra los comandos MAC"],
];
export const T_TIMES = [
  ["RECEIVE_DELAY1", "1 s", "Apertura de RX1 tras el fin del uplink"],
  ["RECEIVE_DELAY2", "2 s", "Apertura de RX2 (siempre DELAY1 + 1 s)"],
  ["JOIN_ACCEPT_DELAY1", "5 s", "Primera ventana tras el Join-Request"],
  ["JOIN_ACCEPT_DELAY2", "6 s", "Segunda ventana tras el Join-Request"],
  ["ADR_ACK_LIMIT", "64", "Uplinks sin downlink antes de activar ADRACKReq"],
  ["ADR_ACK_DELAY", "32", "Uplinks adicionales antes de iniciar el backoff"],
  ["ACK_TIMEOUT", "2 ± 1 s", "Espera antes de reintentar un downlink en clase B o C"],
  ["Periodo de baliza", "128 s", "Intervalo entre balizas de clase B"],
];
export const T_DOCS = [
  ["TS001", "LoRaWAN Link Layer Specification", "Protocolo, tramas, comandos MAC y clases"],
  ["TS002", "LoRaWAN Backend Interfaces", "Mensajería entre NS, JS, AS y roaming"],
  ["RP002", "Regional Parameters", "Planes de frecuencia, data rates y límites por región"],
  ["TS003", "Application Layer Clock Synchronization", "Sincronización de reloj sobre la capa de aplicación"],
  ["TS004", "Fragmented Data Block Transport", "Transporte fragmentado, base de FUOTA"],
  ["TS005", "Remote Multicast Setup", "Configuración de grupos multicast"],
  ["TS006", "Firmware Management Protocol", "Gestión de actualizaciones de firmware"],
];
