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
          e7: "ACL module could not be implemented. Please contact your administrator.",
        }
      },
      mainPanel: {
        home: "Home",
        models: "Models",
        admin: "Admin",
        logout: "Logout",
        translate: "Change language",
        zendroStudio: "Zendro Studio",
        errors: {
          e1: "An error occurred while trying load the new language.",
        }
      },
      modelPanels: {
        internalId: "Unique Identifier",
        addNew: "Add new",
        importCSV: "Import from CSV",
        downloadsOptions: "Download options",
        downloadsOp1: "Export data to CSV",
        downloadsOp2: "Download table-template to CSV",
        viewDetails: "View details",
        edit: "Edit",
        delete: "Delete",
        actions: "Actions",
        rowsPerPage: "Rows per page",
        of: "of",

        //toggle buttons
        table: "Table",
        plot: "Plot",
        plotEditor: "Plot Editor",

        //plot panel
        plot1: {
          title: "Bar chart",
          description: "Select a model attribute and click on button 'generate plot' to generate a frequency distribution bar chart of the selected attribute.",
          label: "Attributes",
          none: 'None',
          button: "Generate plot",
        },

        details: "Details",
        detailOf: "Detail of",
        new: "New",
        editing: "Editing",
        //search
        search: "Search",
        clearSearch: "Clear search",
        showSearchBar: "Show search bar",
        hideSearchBar: "Hide search bar",
        //--
        completed: "completed",
        model: "Model",
        attributes: "Attributes",
        associations: "Associations",
        rows: "Rows",
        noData: "No data to display",
        noItemsAdded: "No items added",
        noItemsToRemove: "No records marked for dis-association",
        noItemsToAdd: "No records marked for association",
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
        //save/update confirmation dialogs
        saveIncompleteAccept: "YES, SAVE",
        saveIncompleteReject: "DON'T SAVE YET",
        updateAccept: "I understand",
        cancelChangesAccept: "YES, EXIT",
        cancelChangesReject: "STAY",
        //noAcceptableFields
        invalidFields: "Some fields are not valid.",
        invalidFieldsB: "To continue, please correct these fields.",
        //noIncompleteFields
        incompleteFields: "Some fields are empty.",
        incompleteFieldsB: "Do you want to continue anyway?",
        //cancelChanges
        cancelChanges: "The edited information has not been saved",
        cancelChangesB: "Some fields have been edited, if you continue without save, the changes will be lost, you want to continue?",
        //warnings
        deletedWarning: "This item no longer exists. It was deleted elsewhere.",
        updatedWarning: "This item was updated elsewhere.",

        //lists
        add: "Add",
        remove: "Remove",
        notAssociated: "Not associated",
        noAssociations: "No associations",
        toAdd: "To add",
        transferToAdd: "Transfer to records to add",
        untransferToAdd: "Remove from records to add",
        associated: "Associated",
        associatedRecord: "Associated record",
        //
        noAssociatedItem: "There is no associated record currently",
        noAssociatedItemB: "No associated record",
        uncheckToDissasociate: "Uncheck to disassociate",
        checkToReassociate: "Check to keep associated",
        //
        toRemove: "To remove",
        transferToRemove: "Transfer to records to remove",
        alreadyToRemove: "Already on to-remove list",
        untransferToRemove: "Remove from to-remove list",
        toAddHelperA: "Please select ",
        toAddHelperB: " that you want to be associated with this ",
        toRemoveHelperA: "Please select ",
        toRemoveHelperB: " that you no longer want to be associated with this ",
        theRecord: "the record",
        theRecords: "the records",

        //pagination
        goToFirstPage: "First page",
        goToPreviousPage: "Previous page",
        goToNextPage: "Next page",
        goToLastPage: "Last page",
        reloadList: "Reload the list",
        count: "Count",

        //float & int
        floatMaxErr: "This is a Float field, the maximum valid positive number is 1.79769313486231e+308. Entered value: ",
        floatMinErr: "This is a Float field, the minimum valid negative number is -1.79769313486231e+308. Entered value: ",
        intMaxErr: "This is an Int field, the maximum valid positive number is 2147483647. Entered value: ",
        intMinErr: "This is an Int field, the minimum valid negative number is -2147483647. Entered value: ",
        intRoundedWarning: "This is an Int field, the decimals will be rounded. Value taken: ",
        valueTaken: "Value taken: ",
        invalidNumber: "Invalid number",
        undefinedNumber: "Undefined number, no value will be sent for modification on this field",
        number: "number",
        integer: "integer",
        invalidDate: "Invalid date format",

        //notistack
        gotIt: "Got it",
        dismiss: "Dismiss",

        //password
        emptyPasswordWarning: "Please enter a new password",
        emptyPasswordWarning2: "Please re-enter the new password",
        passwordsDoNotMatch: "Passwords do not match",
        showPassword: "Show password",
        changePassword: "Change password",
        newPassword: "New password",
        enterNewPassword: "Please enter the new password.",
        newPasswordLabel: "New password",
        newPasswordLabel2: "Confirm the new password",
        changeThePassword: "Change password",

        //entered & not entered
        valueEntered: "Value entered",
        valueNotEntered: "Value not entered",

        messages: {
          msg1: "The data has been sent. A report with the status of the import process will be sent to your email.",
          msg2: "Null data received: GraphQL query returns no data.",
          msg3: "File exceeds limit of ",
          //delete
          msg4: "Record deleted successfully.",
          //update
          msg5: "Record updated successfully.",
          //create
          msg6: "Record created successfully.",
          //csv template
          msg7: "Template downloaded successfully.",
          //no permissions
          msg8: "You need permissions to access this section.",
          msg9: "Please request permissions.",
          msg10: "Checking permissions...",
          msg11: "Section not found.",
          msg12: "Are you sure it should be here?",
          msg13: "Page not found.",
          couldNotLoaded: "Component could not be loaded",
          goodConnection: "Please make sure you have a good network connection",
          apiCouldNotLoaded: "API could not be loaded",
          seeConsoleError: "Please see console log for more details on this error"
        },
        errors: {
          details: "Error details:",
          noDetails: "No error details.",
          e1: "An error occurred while trying to execute the GraphQL query. Please contact your administrator.",
          e2: "An error occurred while trying to execute the GraphQL query, cannot process server response. Please contact your administrator.",
          e3: "The GraphQL query returned a response with errors. Please contact your administrator.",
          data: {
            e1: "No data was received from the server.",
            e2: "could not be fetched.",
            e3: "fetched with errors.",
            e4: "received, does not have the expected format.",
          },
          request: {
            e1: "Error in the request to the server",
          }
        }

      },
    }
  },

  de: {
    translation: {
      login: {
        email: "Email",
        password: "Passwort",
        login: "Einloggen",
        showPassword: "Passwort anzeigen",
        errors: {
          e1: "Bitte geben Sie eine gültige Email-Adresse ein. Beispiel: meineEmail@unternehmen.abc",
          e2: "Passwort wird benötigt",
          e3: "Die von Ihnen angegebenen Anmeldeinformationen sind nicht korrekt.",
          e4: "Das vom Server empfangene Token konnte nicht validiert werden.",
          e5: "Verbindung zum Server konnte nicht hergestellt werden. Bitte wenden Sie sich an Ihren Netzwerkadministrator.",
          e6: "Beim Versuch, eine Verbindung zum Server herzustellen, ist ein Fehler aufgetreten. Bitte wenden Sie sich an Ihren Administrator.",
          e7: "ACL-Modul konnte nicht implementiert werden. Bitte wenden Sie sich an Ihren Administrator.",
        }
      },
      mainPanel: {
        home: "Zuhause",
        models: "Modelle",
        admin: "Admin",
        logout: "Ausloggen",
        translate: "Sprache ändern",
        errors: {
          e1: "Beim Laden der neuen Sprache ist ein Fehler aufgetreten.",
        }
      },
      modelPanels: {
        internalId: "Eindeutige Kennung",
        addNew: "Neue hinzufügen",
        importCSV: "Aus CSV importieren",
        downloadsOptions: "Download-Optionen",
        downloadsOp1: "Daten in CSV exportieren",
        downloadsOp2: "Laden Sie die Tabellenvorlage in CSV herunter",
        viewDetails: "Details anzeigen",
        edit: "Bearbeiten",
        delete: "Löschen",
        actions: "Aktionen",
        rowsPerPage: "Zeilen pro Seite",
        of: "von",

        //toggle buttons
        table: "Tabelle",
        plot: "Plot",

        //plot panel
        plot1: {
          title: "Balkendiagramm",
          description: "Wählen Sie ein Modellattribut aus und klicken Sie auf die Schaltfläche 'Plot generieren', um ein Häufigkeitsverteilungsbalkendiagramm des ausgewählten Attributs zu erstellen.",
          label: "Attribute",
          none: "Keiner",
          button: "Plot generieren",
        },

        details: "Einzelheiten",
        detailOf: "Detail von",
        new: "Neu",
        editing: "Bearbeitung",
        //search
        search: "Suche",
        clearSearch: "Saubere Suche",
        showSearchBar: "Suchleiste anzeigen",
        hideSearchBar: "Suchleiste ausblenden",
        //--
        completed: "abgeschlossen",
        model: "Modell",
        attributes: "Attribute",
        associations: "Verbände",
        rows: "Reihen",
        noData: "Keine Daten zum Anzeigen",
        noItemsAdded: "Keine Artikel hinzugefügt",
        noItemsToRemove: "Keine Datensätze zum Trennen markiert",
        noItemsToAdd: "Keine Datensätze für die Zuordnung markiert",
        save: "Speichern",
        uploading: "Hochladen",
        cancel: "Stornieren",
        close: "Schließen",
        upload: "Hochladen",
        uploadHelper: "Bitte wählen Sie die CSV-Datei aus, die Sie importieren möchten.",
        //delete confirmation dialog
        deleteMsg: "Möchtest du diesen Gegenstand wirklich löschen?",
        deleteReject: "Nicht löschen",
        deleteAccept: "Ja, löschen",
        //save/update confirmation dialogs
        saveIncompleteAccept: "JA, SPEICHERN",
        saveIncompleteReject: "SPEICHERN SIE NOCH NICHT",
        updateAccept: "ich verstehe",
        cancelChangesAccept: "JA, BEENDEN",
        cancelChangesReject: "BLEIBE",
        //noAcceptableFields
        invalidFields: "Einige Felder sind ungültig.",
        invalidFieldsB: "Bitte korrigieren Sie diese Felder, um fortzufahren.",
        //noIncompleteFields
        incompleteFields: "Einige Felder sind leer.",
        incompleteFieldsB: "Möchtest du trotzdem weitermachen?",
        //cancelChanges
        cancelChanges: "Die bearbeiteten Informationen wurden nicht gespeichert",
        cancelChangesB: "Einige Felder wurden bearbeitet. Wenn Sie ohne Speichern fortfahren, gehen die Änderungen verloren. Möchten Sie fortfahren?",
        //warnings
        deletedWarning: "Dieser Artikel existiert nicht mehr. Es wurde an anderer Stelle gelöscht.",
        updatedWarning: "Dieser Artikel wurde an anderer Stelle aktualisiert.",

        //lists
        add: "Hinzufügen",
        remove: "Löschen",
        notAssociated: "Nicht zugeordnet",
        noAssociations: "Keine Assoziationen",
        toAdd: "Hinzufügen",
        transferToAdd: "In Datensätze übertragen, um sie hinzuzufügen",
        untransferToAdd: "Aus den Datensätzen entfernen, um sie hinzuzufügen",
        associated: "Zugehöriger Datensatz",
        associatedRecord: "Zugehöriger Datensatz",
        //
        noAssociatedItem: "Derzeit ist kein Datensatz zugeordnet",
        noAssociatedItemB: "Kein zugeordneter Datensatz",
        uncheckToDissasociate: "Uncheck to disassociate",
        checkToReassociate: "Check, um verbunden zu bleiben",
        //
        toRemove: "Zu entfernen",
        transferToRemove: "In zu entfernende Datensätze übertragen",
        alreadyToRemove: "Bereits zu entfernende Liste",
        untransferToRemove: "Aus zu entfernender Liste entfernen",
        toAddHelperA: "Bitte auswählen ",
        toAddHelperB: " die Sie damit verknüpfen möchten ",
        toRemoveHelperA: "Bitte auswählen ",
        toRemoveHelperB: " die Sie nicht mehr mit diesem verknüpfen möchten ",
        theRecord: "der Datensatz",
        theRecords: "die Aufzeichnungen",

        //pagination
        goToFirstPage: "Erste Seite",
        goToPreviousPage: "Vorherige Seite",
        goToNextPage: "Nächste Seite",
        goToLastPage: "Letzte Seite",
        reloadList: "Laden Sie die Liste neu",
        count: "Anzahl",

        //float & int
        floatMaxErr: "Dies ist ein Float-Feld. Die maximal gültige positive Zahl ist 1.79769313486231e+308. Eingegebener Wert: ",
        floatMinErr: "Dies ist ein Float-Feld. Die minimal gültige negative Zahl ist -1,79769313486231e+308. Eingegebener Wert: ",
        intMaxErr: "Dies ist ein Int-Feld, die maximal gültige positive Zahl ist 2147483647. Eingegebener Wert: ",
        intMinErr: "Dies ist ein Int-Feld, die minimal gültige negative Zahl ist -2147483647. Eingegebener Wert: ",
        intRoundedWarning: "Dies ist ein Int-Feld. Die Dezimalstellen werden gerundet. Wert genommen: ",
        valueTaken: "Wert genommen: ",
        invalidNumber: "Ungültige Nummer",
        undefinedNumber: "Undefinierte Nummer, in diesem Feld wird kein Wert zur Änderung gesendet.",
        number: "nummer",
        integer: "ganze Zahl",
        invalidDate: "Ungültiges Datumsformat",

        //notistack
        gotIt: "Ich habs",
        dismiss: "Entlassen",

        //password
        emptyPasswordWarning:"Bitte geben Sie ein neues Passwort ein",
        emptyPasswordWarning2:"Bitte geben Sie das neue Passwort erneut ein",
        passwordsDoNotMatch:"Passwörter stimmen nicht überein",
        showPassword: "Passwort anzeigen",
        changePassword: "Passwort ändern",
        newPassword: "Neues Passwort",
        enterNewPassword: "Bitte geben Sie das neue Passwort ein",
        newPasswordLabel: "Neues Passwort",
        newPasswordLabel2: "Bestätigen Sie das neue Passwort",
        changeThePassword: "Passwort ändern",

        //entered & not entered
        valueEntered: "Wert eingegeben",
        valueNotEntered: "Wert nicht eingegeben",

        messages: {
          msg1: "Die Daten wurden gesendet. Ein Bericht mit dem Status des Importvorgangs wird an Ihre E-Mail gesendet.",
          msg2: "NULL-Daten empfangen: Die GraphQL-Abfrage gibt keine Daten zurück.",
          msg3: "Datei überschreitet das Limit von ",
          //delete
          msg4: "Datensatz erfolgreich gelöscht.",
          //update
          msg5: "Datensatz erfolgreich aktualisiert.",
          //create
          msg6: "Datensatz erfolgreich erstellt.",
          //csv template
          msg7: "Vorlage erfolgreich heruntergeladen.",
          //no permissions
          msg8: "Sie benötigen Berechtigungen, um auf diesen Abschnitt zugreifen zu können.",
          msg9: "Bitte fordern Sie Berechtigungen an.",
          msg10: "Berechtigungen überprüfen...",
          msg11: "Abschnitt nicht gefunden.",
          msg12: "Bist du sicher, dass es hier sein sollte?",
          msg13: "Seite nicht gefunden.",
          couldNotLoaded: "Die Komponente konnte nicht geladen werden",
          goodConnection: "Stellen Sie sicher, dass Sie eine gute Netzwerkverbindung haben",
          apiCouldNotLoaded: "API konnte nicht geladen werden",
          seeConsoleError: "Weitere Informationen zu diesem Fehler finden Sie im Konsolenprotokoll"
        },
        errors: {
          details: "Fehlerdetails:",
          noDetails: "Keine Fehlerdetails.",
          e1: "Beim Versuch, die GraphQL-Abfrage auszuführen, ist ein Fehler aufgetreten. Bitte wenden Sie sich an Ihren Administrator.",
          e2: "Beim Versuch, die GraphQL-Abfrage auszuführen, ist ein Fehler aufgetreten. Die Serverantwort kann nicht verarbeitet werden. Bitte wenden Sie sich an Ihren Administrator.",
          e3: "Die GraphQL-Abfrage hat eine Antwort mit Fehlern zurückgegeben. Bitte wenden Sie sich an Ihren Administrator.",
          data: {
            e1: "Es wurden keine Daten vom Server empfangen.",
            e2: "nicht abgerufen.",
            e3: "mit Fehlern abgerufen",
            e4: "empfangen, hat nicht das erwartete Format.",
          },
          request: {
            e1: "Fehler in der Anfrage an den Server",
          }
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
          e7: "Ocurrió un error con el módulo ACL. Por favor contacte al administrador de la aplicación.",
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
        internalId: "Identificador Único",
        //actions
        addNew: "Agregar nuevo",
        importCSV: "Importar de CSV",
        downloadsOptions: "Opciones de descarga",
        downloadsOp1: "Exportar datos a CSV",
        downloadsOp2: "Descargar plantilla de tabla a CSV",
        viewDetails: "Ver detalles",
        edit: "Editar",
        delete: "Borrar",
        actions: "Acciones",

        //pagination
        rowsPerPage: "Renglones por página",
        of: "de",

        //toggle buttons
        table: "Tabla",
        plot: "Plot",

        //plot panel
        plot1: {
          title: "Gráfica de barras",
          description: "Seleccione un atributo y de click en el botón 'generar plot' para generar una gráfica de distribución de frecuencia sobre el atributo seleccionado.",
          label: "Atributos",
          none: "Ninguno",
          button: "Generar plot",
        },

        details: "Detalles",
        detailOf: "Detalle de",
        new: "Nuevo",
        editing: "Editando",
        //search
        search: "Buscar",
        clearSearch: "Limpiar búsqueda",
        showSearchBar: "Mostrar barra de búsqueda",
        hideSearchBar: "Ocultar barra de búsqueda",
        //--
        completed: "completados",
        model: "Modelo",
        attributes: "Atributos",
        associations: "Asociaciones",
        rows: "Renglones",
        noData: "No hay datos para mostrar",
        noItemsAdded: "No se han agregado registros",
        noItemsToRemove: "No hay registros marcados para desasociar",
        noItemsToAdd: "No hay registros marcados para asociar",
        save: "Guardar",
        uploading: "Importando",
        cancel: "Cancelar",
        close: "Cerrar",
        upload: "Subir",
        uploadHelper: "Por favor elija el archivo CSV que desea importar.",
        //delete confirmation dialog
        deleteMsg: "¿Está seguro que desea eliminar este elemento?",
        deleteReject: "No borrar",
        deleteAccept: "Sí, borrar",
        //save/update confirmation dialogs
        saveIncompleteAccept: "SÍ, GUARDAR",
        saveIncompleteReject: "NO GUARDAR TODAVÍA",
        updateAccept: "Entendido",
        cancelChangesAccept: "Sí, deseo salir",
        cancelChangesReject: "Permanecer",
        //noAcceptableFields
        invalidFields: "Algunos campos no son válidos.",
        invalidFieldsB: "Para continuar, por favor corrija estos campos.",
        //noIncompleteFields
        incompleteFields: "Algunos campos están vacíos.",
        incompleteFieldsB: "¿Desea continuar de todas formas?",
        //cancelChanges
        cancelChanges: "Los cambios no se han guardado.",
        cancelChangesB: "Algunos campos han sido editados, si continua sin guardar, estos cambios se perderán, ¿desea continuar?",
        //warnings
        deletedWarning: "Este registro ya no existe. Fue borrado en alguna otra parte.",
        updatedWarning: "Este registro fué actualizado en alguna otra parte.",

        //lists
        add: "Agregar",
        remove: "Eliminar",
        notAssociated: "No associados",
        noAssociations: "Sin asociaciones",
        toAdd: "Por agregar",
        transferToAdd: "Transferir a registros por agregar",
        untransferToAdd: "Quitar de registros por agregar",
        associated: "Registro asociado",
        associatedRecord: "Registro asociado",
        //
        noAssociatedItem: "Actualmente no hay un registro asociado",
        noAssociatedItemB: "No hay registro asociado",
        uncheckToDissasociate: "Desmarque para desasociar",
        checkToReassociate: "Marque para mantener la asociación",
        //
        toRemove: "Por eliminar",
        transferToRemove: "Transferir a registros por eliminar",
        alreadyToRemove: "Ya está en los registros por eliminar",
        untransferToRemove: "Quitar de registros por eliminar",
        toAddHelperA: "Por favor seleccione ",
        toAddHelperB: " que desea asociar con este registro ",
        toRemoveHelperA: "Por favor seleccione ",
        toRemoveHelperB: " que desea desasociar de este registro ",
        theRecord: "el registro",
        theRecords: "los registros",

        //pagination
        goToFirstPage: "Primera página",
        goToPreviousPage: "Página anterior",
        goToNextPage: "Página siguiente",
        goToLastPage: "Última página",
        reloadList: "Recargar la lista",
        count: "Cuenta",

        //float & int
        floatMaxErr: "Este es un campo tipo Float, el máximo valor positivo válido es 1.79769313486231e+308. Valor ingresado: ",
        floatMinErr: "Este es un campo tipo Float, el mínimo valor negativo válido es -1.79769313486231e+308. Valor ingresado: ",
        intMaxErr: "Este es un campo tipo Int, el valor positivo máximo válido es 2147483647. Valor ingresado: ",
        intMinErr: "Este es un campo tipo Int, el valor negativo mínimo válido es -2147483647. Valor ingresado: ",
        intRoundedWarning: "Este es un campo tipo Int, los decimales serán redondeados. Valor tomado: ",
        valueTaken: "Valor tomado: ",
        invalidNumber: "Número no válido",
        undefinedNumber: "Número indefinido, no se enviará ningún valor para modificar sobre este campo.",
        number: "número",
        integer: "entero",
        invalidDate: "Formato de fecha no válido",

        //notistack
        gotIt: "Entendido",
        dismiss: "Descartar",

        //password
        emptyPasswordWarning: "Por favor ingrese una nueva contraseña",
        emptyPasswordWarning2: "Por favor re-ingrese la nueva contraseña",
        passwordsDoNotMatch: "Las contraseñas no coinciden",
        showPassword: "Mostrar contraseña",
        changePassword: "Cambiar contraseña",
        newPassword: "Nueva contraseña",
        enterNewPassword: "Por favor ingrese la nueva contraseña",
        newPasswordLabel: "Nueva contraseña",
        newPasswordLabel2: "Confirme la nueva contraseña",
        changeThePassword: "Cambiar la contraseña",

        //entered & not entered
        valueEntered: "Valor ingresado",
        valueNotEntered: "Valor no ingresado",

        messages: {
          msg1: "Los datos se han enviado. Un informe con el estatus del proceso de importación será enviado a su correo electrónico.",
          msg2: "Datos null recibidos: la consulta GraphQL no devolvió información.",
          msg3: "El archivo excede el límite de ",
          //delete
          msg4: "Registro borrado con éxito.",
          //update
          msg5: "Registro actualizado con éxito.",
          //create
          msg6: "Registro creado con éxito.",
          //csv template
          msg7: "La plantilla se descargó con éxito",
          //no permissions
          msg8: "Necesitas permisos para acceder a esta seccion.",
          msg9: "Por favor solicite permisos.",
          msg10: "Validando permisos...",
          msg11: "Sección no encontrada.",
          msg12: "¿Está seguro de que debería estar aquí?",
          msg13: "Página no encontrada.",
          couldNotLoaded: "No se pudo cargar el componente",
          goodConnection: "Por favor asegúrese de tener una buena conexión de red",
          apiCouldNotLoaded: "No se pudo cargar la petición API",
          seeConsoleError: "Por favor vea la consola de log para obtener más información sobre este error"
        },
        errors: {
          details: "Detalles del error:",
          noDetails: "No hay más información del error.",
          e1: "Ocurrió un error al intentar ejecutar la consulta GraphQL. Por favor contacte al administrador de la aplicación.",
          e2: "Ocurrió un error al intentar ejecutar la consulta GraphQL, no se puede procesar la respuesta recibida del servidor. Por favor contacte al administrador de la aplicación.",
          e3: "La consulta GraphQL retornó una respuesta con errores. Por favor contacte al administrador de la aplicación.",
          data: {
            e1: "No se recibieron datos del servidor.",
            e2: "no obtenidos.",
            e3: "obtenidos con errores",
            e4: "recibidos, no tiene el formato esperado.",
          },
          request: {
            e1: "Error en la petición al servidor.",
          }
        }
      },
    }
  },
};
