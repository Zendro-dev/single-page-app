export default {
  en: {
    translation: {
      login: {
        email: "Email",
        password: "Password",
        login: "Login",
        showPassword: "Show Password",
        errors: {
          e1: "Please enter a valid e-mail. Example: myEmail@company.abc",
          e2: "Password is required",
          e3: "The credentials you provided are not correct.",
          e4: "The token received by server could not be validated.",
          e5: "Could not connect to server. Please consult your network administrator.",
          e6: "An error occurred while trying to contact the server. Please contact your administrator.",
        }
      },
      mainPanel: {
        home: "Home",
        models: "Models",
        admin: "Admin",
        logout: "Logout",
        translate: "Change language",
        errors: {
          e1: "An error occurred while trying load the new language.",
        }
      },
      modelPanels: {
        addNew: "Add new",
        importCSV: "Import from CSV",
        exportCSV: "Export to CSV",
        viewDetails: "View details",
        edit: "Edit",
        delete: "Delete",
        actions: "Actions",
        rowsPerPage: "Rows per page",
        of: "of",

        details: "Details",
        detailOf: "Detail of",
        new: "New",
        editing: "Editing",
        search: "Search",
        clearSearch: "Clear search",
        completed: "completed",
        model: "Model",
        attributes: "Attributes",
        associations: "Associations",
        rows: "Rows",
        noData: "No data to display",
        save: "Save",
        uploading: "Uploading",
        cancel: "Cancel",
        close: "Close",
        upload: "Upload",
        uploadHelper: "Please choose the CSV file you want to import.",
        //delete confirmation dialog
        deleteMsg: "Are you sure you want to delete this item?",
        deleteReject: "Do not delete",
        deleteAccept: "Yes, delete",

        messages: {
          msg1: "The data has been sent. A report with the status of the import process will be sent to your email, please be aware.",
          msg2: "Null data received: GraphQL query returns no data.",
          msg3: 'File exceeds limit of ',
        },
        errors: {
          e1: "An error occurred while trying to execute the GraphQL query. Please contact your administrator.",
        }

      },
    }
  },

  es: {
    translation: {
      login: {
        email: "Cuenta de correo",
        password: "Contraseña",
        login: "Ingresar",
        showPassword: "Mostrar contraseña",
        errors: {
          e1: "Por favor ingrese un correo electrónico válido. Por ejemplo: miCorreo@dominio.abc",
          e2: "Es necesario que ingrese su contraseña.",
          e3: "Las credenciales que ingresó no son correctas.",
          e4: "El token no pudo ser validado.",
          e5: "No se puede establecer conexión con el servidor. Por favor contacte al administrador de la red.",
          e6: "Ocurrió un error al intentar contactar con el servidor. Por favor contacte al administrador de la aplicación.",
        }
      },
      mainPanel: {
        home: "Inicio",
        models: "Modelos",
        admin: "Admin",
        logout: "Salir",
        translate: "Cambiar idioma",
        errors: {
          e1: "Ocurrió un error al intentar cargar el nuevo lenguaje.",
        }
      },
      modelPanels: {
        addNew: "Agregar nuevo",
        importCSV: "Importar de CSV",
        exportCSV: "Exportar a CSV",
        viewDetails: "Ver detalles",
        edit: "Editar",
        delete: "Borrar",
        actions: "Acciones",
        rowsPerPage: "Renglones por página",
        of: "de",

        details: "Detalles",
        detailOf: "Detalle de",
        new: "Nuevo",
        editing: "Editando",
        search: "Buscar",
        clearSearch: "Limpiar búsqueda",
        completed: "completados",
        model: "Modelo",
        attributes: "Atributos",
        associations: "Asociaciones",
        rows: "Renglones",
        noData: "No hay datos para mostrar",
        save: "Guardar",
        uploading: "Importando",
        cancel: "Cancelar",
        close: "Cerrar",
        upload: "Subir",
        uploadHelper: "Por favor elija el archivo CSV que desea importar.",
        //delete confirmation dialog
        deleteMsg: "Está seguro que desea eliminar este elemento?",
        deleteReject: "No borrar",
        deleteAccept: "Sí, borrar",

        messages: {
          msg1: "Los datos se han enviado. Un informe con el estatus del proceso de importación será enviado a su correo electrónico, por favor esté atento.",
          msg2: "Datos null recibidos: la consulta GraphQL no devolvió información.",
          msg3: 'El archivo excede el límite de ',
        },
        errors: {
          e1: "Ocurrió un error al intentar ejecutar la consulta GraphQL. Por favor contacte al administrador de la aplicación.",
        }
      },
    }
  },
};
