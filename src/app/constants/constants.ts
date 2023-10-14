// Para email
export const EMAIL_VALIDATE = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';

// Para email de la UES
export const EMAIL_VALIDATE_UES ='^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@ues.edu.sv';

// Para nombres con tildes
export const NAME_VALIDATE = '^((?!\\s)(?!.*\\s$)[A-Za-zÁáÉéÍíÓóÚúÜüÑñÀàÈèÌìÒòÙùÂâÊêÎîÔôÛûÄäËëÏïÖöŸÿ]+( [A-Za-zÁáÉéÍíÓóÚúÜüÑñÀàÈèÌìÒòÙùÂâÊêÎîÔôÛûÄäËëÏïÖöŸÿ]+)*)$';

// Para números
export const NUMBER_VALIDATE = '^[0-9]+([\\.,][0-9]+)?$';

// Para string
export const STRING_VALIDATE = '^([A-Za-z]+[ ]?){1,2}$';

// Para entero
export const INTEGER_VALIDATE = '^[0-9]+$';

// Para decimal .00
export const DECIMAL_VALIDATE = '^[0-9]+(\\.[0-9]{1,2})?$';

// Para fecha
export const DATETIME_VALIDATE = '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/(\\d{4}) (20|21|22|23|[01]\\d|\\d)(([:][0-5]\\d){1,2})$';

// Para Texto
export const TEXT_VALIDATE = '^([A-Za-z]+[ ]?){1,2}$';

// Para email
export const EMAIL_VALIDATE_GENERAL = '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$';


export const TEXTO_CARACTER_ESPECIAL = '^([A-Za-z/-_*.]+[ ]?){1,5}$';

export const TEXTO_PLACA = '[a-zA-Z]{1,2}[a-zA-Z0-9]{0,3}[a-zA-Z0-9]{3}';

// Validar Nombre reales
export const NAME_TILDES_VALIDATE = '^(?!\\s)(?!.*\\s$)[A-Za-zÁáÉéÍíÓóÚúÜüÑñÀàÈèÌìÒòÙùÂâÊêÎîÔôÛûÄäËëÏïÖöŸÿ]+( [A-Za-zÁáÉéÍíÓóÚúÜüÑñÀàÈèÌìÒòÙùÂâÊêÎîÔôÛûÄäËëÏïÖöŸÿ]+)*$';

export const NAME_STRING_NUMBER_VALIDATE = '^(?!\\s)(?!.*\\s$)[A-Za-zÁáÉéÍíÓóÚúÜüÑñÀàÈèÌìÒòÙùÂâÊêÎîÔôÛûÄäËëÏïÖöŸÿ0-9]+( [A-Za-zÁáÉéÍíÓóÚúÜüÑñÀàÈèÌìÒòÙùÂâÊêÎîÔôÛûÄäËëÏïÖöŸÿ0-9]+)*$';




