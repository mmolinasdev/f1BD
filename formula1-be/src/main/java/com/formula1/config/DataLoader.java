package com.formula1.config;

import com.formula1.model.entity.*;
import com.formula1.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired private RolRepository rolRepository;
    @Autowired private PersonaRepository personaRepository;
    @Autowired private PilotoRepository pilotoRepository;
    @Autowired private EscuderiaRepository escuderiaRepository;
    @Autowired private ContratoRepository contratoRepository;
    @Autowired private TemporadaRepository temporadaRepository;
    @Autowired private ReglaPuntuacionRepository reglaPuntuacionRepository;
    @Autowired private CircuitoRepository circuitoRepository;
    @Autowired private VarianteCircuitoRepository varianteCircuitoRepository;
    @Autowired private GranPremioRepository granPremioRepository;
    @Autowired private SesionRepository sesionRepository;
    @Autowired private ResultadoCarreraRepository resultadoCarreraRepository;
    @Autowired private ResultadoClasificacionRepository resultadoClasificacionRepository;
    @Autowired private ClasificacionCampeonatoRepository clasificacionCampeonatoRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (rolRepository.count() > 0) return;

        // 1. Roles
        saveRol("ADMIN", "Administrador del sistema");
        saveRol("LECTOR", "Usuario con acceso de solo lectura");
        saveRol("EXPORTADOR", "Usuario que puede exportar datos");
        saveRol("API", "Acceso via API externa");

        // 2 & 3. Personas + Pilotos
        Piloto ver = savePiloto("PASAPORTE", "NL-VER-001", "Max", "Verstappen",
                LocalDate.of(1997, 9, 30), "Holandesa", 1, "VER");
        Piloto per = savePiloto("PASAPORTE", "MX-PER-011", "Sergio", "Pérez",
                LocalDate.of(1990, 1, 26), "Mexicana", 11, "PER");
        Piloto ham = savePiloto("PASAPORTE", "GB-HAM-044", "Lewis", "Hamilton",
                LocalDate.of(1985, 1, 7), "Británica", 44, "HAM");
        Piloto rus = savePiloto("PASAPORTE", "GB-RUS-063", "George", "Russell",
                LocalDate.of(1998, 2, 15), "Británica", 63, "RUS");
        Piloto lec = savePiloto("PASAPORTE", "MC-LEC-016", "Charles", "Leclerc",
                LocalDate.of(1997, 10, 16), "Monegasca", 16, "LEC");
        Piloto sai = savePiloto("PASAPORTE", "ES-SAI-055", "Carlos", "Sainz",
                LocalDate.of(1994, 9, 1), "Española", 55, "SAI");
        Piloto nor = savePiloto("PASAPORTE", "GB-NOR-004", "Lando", "Norris",
                LocalDate.of(1999, 11, 13), "Británica", 4, "NOR");
        Piloto pia = savePiloto("PASAPORTE", "AU-PIA-081", "Oscar", "Piastri",
                LocalDate.of(2001, 4, 6), "Australiana", 81, "PIA");
        Piloto alo = savePiloto("PASAPORTE", "ES-ALO-014", "Fernando", "Alonso",
                LocalDate.of(1981, 7, 29), "Española", 14, "ALO");
        Piloto str = savePiloto("PASAPORTE", "CA-STR-018", "Lance", "Stroll",
                LocalDate.of(1998, 10, 29), "Canadiense", 18, "STR");

        // 4. Escuderías
        Escuderia rbr = saveEscuderia("Oracle Red Bull Racing",                        "RBR", "Austriaca",      "Reino Unido", "Milton Keynes");
        Escuderia mer = saveEscuderia("Mercedes-AMG Petronas Formula One Team",        "MER", "Alemana",        "Reino Unido", "Brackley");
        Escuderia fer = saveEscuderia("Scuderia Ferrari",                              "FER", "Italiana",       "Italia",      "Maranello");
        Escuderia mcl = saveEscuderia("McLaren Formula 1 Team",                        "MCL", "Británica",      "Reino Unido", "Woking");
        Escuderia amf = saveEscuderia("Aston Martin Aramco Cognizant Formula One Team","AMF", "Británica",      "Reino Unido", "Banbury");
        Escuderia alp = saveEscuderia("BWT Alpine F1 Team",                            "ALP", "Francesa",       "Francia",     "Enstone");
        Escuderia alr = saveEscuderia("Alfa Romeo F1 Team Stake",                      "ALR", "Suiza",          "Suiza",       "Hinwil");
        Escuderia ath = saveEscuderia("Scuderia AlphaTauri",                           "ATH", "Italiana",       "Italia",      "Faenza");
        Escuderia has = saveEscuderia("MoneyGram Haas F1 Team",                        "HAS", "Estadounidense", "Reino Unido", "Banbury");
        Escuderia wil = saveEscuderia("Williams Racing",                               "WIL", "Británica",      "Reino Unido", "Grove");

        // 5. Contratos 2023
        saveContrato(ver, rbr, LocalDate.of(2023, 1, 1));
        saveContrato(per, rbr, LocalDate.of(2023, 1, 1));
        saveContrato(ham, mer, LocalDate.of(2023, 1, 1));
        saveContrato(rus, mer, LocalDate.of(2023, 1, 1));
        saveContrato(lec, fer, LocalDate.of(2023, 1, 1));
        saveContrato(sai, fer, LocalDate.of(2023, 1, 1));
        saveContrato(nor, mcl, LocalDate.of(2023, 1, 1));
        saveContrato(pia, mcl, LocalDate.of(2023, 1, 1));
        saveContrato(alo, amf, LocalDate.of(2023, 1, 1));
        saveContrato(str, amf, LocalDate.of(2023, 1, 1));

        // 6. Temporada 2023
        Temporada t2023 = new Temporada();
        t2023.setAnio(2023);
        t2023.setEstado("FINALIZADA");
        t2023.setNumGps(22);
        t2023.setFechaInicio(LocalDate.of(2023, 3, 5));
        t2023.setFechaFin(LocalDate.of(2023, 11, 26));
        t2023 = temporadaRepository.save(t2023);

        // 7. Reglas de puntuación 2023
        int[] posCarrera = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        double[] ptsCarrera = {25, 18, 15, 12, 10, 8, 6, 4, 2, 1};
        for (int i = 0; i < posCarrera.length; i++) {
            ReglaPuntuacion r = new ReglaPuntuacion();
            r.setTemporada(t2023);
            r.setTipoSesion("CARRERA");
            r.setPosicion(posCarrera[i]);
            r.setPuntosAsignados(BigDecimal.valueOf(ptsCarrera[i]));
            reglaPuntuacionRepository.save(r);
        }
        int[] posSprint = {1, 2, 3, 4, 5, 6, 7, 8};
        double[] ptsSprint = {8, 7, 6, 5, 4, 3, 2, 1};
        for (int i = 0; i < posSprint.length; i++) {
            ReglaPuntuacion r = new ReglaPuntuacion();
            r.setTemporada(t2023);
            r.setTipoSesion("SPRINT");
            r.setPosicion(posSprint[i]);
            r.setPuntosAsignados(BigDecimal.valueOf(ptsSprint[i]));
            reglaPuntuacionRepository.save(r);
        }

        // 8. Circuitos
        Circuito bahCirc  = saveCircuito("Bahrain International Circuit", "Bahrain",       "Sakhir");
        Circuito jedCirc  = saveCircuito("Jeddah Corniche Circuit",       "Arabia Saudita","Yeda");
        Circuito albCirc  = saveCircuito("Albert Park Circuit",           "Australia",     "Melbourne");
        Circuito monCirc  = saveCircuito("Circuit de Monaco",             "Monaco",        "Monte-Carlo");
        Circuito silCirc  = saveCircuito("Silverstone Circuit",           "Reino Unido",   "Silverstone");

        // 9. Variantes de circuito
        VarianteCircuito vBahrain     = saveVariante(bahCirc, 2012, null, "PERMANENTE", new BigDecimal("5.412"), 15, "HORARIO");
        VarianteCircuito vJeddah      = saveVariante(jedCirc, 2021, null, "CALLEJERO",  new BigDecimal("6.174"), 27, "ANTIHORARIO");
        VarianteCircuito vAlbert      = saveVariante(albCirc, 2022, null, "CALLEJERO",  new BigDecimal("5.278"), 16, "HORARIO");
        VarianteCircuito vMonaco      = saveVariante(monCirc, 1986, null, "CALLEJERO",  new BigDecimal("3.337"), 19, "HORARIO");
        VarianteCircuito vSilverstone = saveVariante(silCirc, 2011, null, "PERMANENTE", new BigDecimal("5.891"), 18, "HORARIO");

        // 10. Grandes Premios
        GranPremio gpBahrain   = saveGranPremio(t2023, vBahrain,    "Gran Premio de Baréin 2023",         1, LocalDate.of(2023, 3, 2),  LocalDate.of(2023, 3, 5));
        GranPremio gpSaudi     = saveGranPremio(t2023, vJeddah,     "Gran Premio de Arabia Saudita 2023", 2, LocalDate.of(2023, 3, 16), LocalDate.of(2023, 3, 19));
        GranPremio gpAustralia = saveGranPremio(t2023, vAlbert,     "Gran Premio de Australia 2023",      3, LocalDate.of(2023, 3, 30), LocalDate.of(2023, 4, 2));

        // 11. Sesiones (CLASIFICACION orden=4, CARRERA orden=5)
        Sesion clasBahrain = saveSesion(gpBahrain,   "CLASIFICACION", 4, LocalDate.of(2023, 3, 4),  "SECA");
        Sesion carBahrain  = saveSesion(gpBahrain,   "CARRERA",       5, LocalDate.of(2023, 3, 5),  "SECA");
        saveSesion(gpSaudi,     "CLASIFICACION", 4, LocalDate.of(2023, 3, 18), "SECA");
        saveSesion(gpSaudi,     "CARRERA",       5, LocalDate.of(2023, 3, 19), "SECA");
        saveSesion(gpAustralia, "CLASIFICACION", 4, LocalDate.of(2023, 4, 1),  "SECA");
        saveSesion(gpAustralia, "CARRERA",       5, LocalDate.of(2023, 4, 2),  "SECA");

        // 12. Resultados de carrera Bahrain
        Contrato cVer = findContrato(ver);
        Contrato cPer = findContrato(per);
        Contrato cAlo = findContrato(alo);
        Contrato cSai = findContrato(sai);
        Contrato cStr = findContrato(str);
        Contrato cHam = findContrato(ham);
        Contrato cLec = findContrato(lec);
        Contrato cNor = findContrato(nor);

        saveResultadoCarrera(carBahrain, ver, cVer, 1, 25.0, 57, "1:33:56.736", 1);
        saveResultadoCarrera(carBahrain, per, cPer, 2, 18.0, 57, "+11.987s",    9);
        saveResultadoCarrera(carBahrain, alo, cAlo, 3, 15.0, 57, "+38.637s",    3);
        saveResultadoCarrera(carBahrain, sai, cSai, 4, 12.0, 57, "+48.051s",    5);
        saveResultadoCarrera(carBahrain, str, cStr, 5, 10.0, 57, "+57.450s",    6);
        saveResultadoCarrera(carBahrain, ham, cHam, 6,  8.0, 57, "+1:08.206s",  4);
        saveResultadoCarrera(carBahrain, lec, cLec, 7,  6.0, 57, "+1:11.141s",  2);
        saveResultadoCarrera(carBahrain, nor, cNor, 8,  4.0, 56, "+1 vuelta",   8);

        // 13. Resultados de clasificación Bahrain
        saveResultadoClasificacion(clasBahrain, ver, 1, "1:29.708", "1:28.265", "1:29.708");
        saveResultadoClasificacion(clasBahrain, lec, 2, "1:30.014", "1:29.321", "1:29.947");
        saveResultadoClasificacion(clasBahrain, alo, 3, "1:30.177", "1:29.334", "1:30.177");
        saveResultadoClasificacion(clasBahrain, ham, 4, "1:30.252", "1:29.561", "1:30.252");
        saveResultadoClasificacion(clasBahrain, sai, 5, "1:30.385", "1:29.614", "1:30.385");
        saveResultadoClasificacion(clasBahrain, str, 6, "1:30.558", "1:29.806", "1:30.558");
        saveResultadoClasificacion(clasBahrain, rus, 7, "1:30.556", "1:29.709", "1:30.556");
        saveResultadoClasificacion(clasBahrain, nor, 8, "1:30.595", "1:29.972", "1:30.595");

        // 14. Clasificación Campeonato 2023
        saveClasificacion(t2023, ver, null, "PILOTOS",       1, 575.0, 19, 21, 12);
        saveClasificacion(t2023, per, null, "PILOTOS",       2, 285.0,  2,  9,  3);
        saveClasificacion(t2023, alo, null, "PILOTOS",       3, 206.0,  0,  8,  0);
        saveClasificacion(t2023, ham, null, "PILOTOS",       4, 234.0,  0,  9,  1);
        saveClasificacion(t2023, lec, null, "PILOTOS",       5, 206.0,  0,  4,  5);

        saveClasificacion(t2023, null, rbr, "CONSTRUCTORES", 1, 860.0, 21, 30, 15);
        saveClasificacion(t2023, null, mer, "CONSTRUCTORES", 2, 409.0,  0, 10,  1);
        saveClasificacion(t2023, null, fer, "CONSTRUCTORES", 3, 406.0,  0,  8,  5);
        saveClasificacion(t2023, null, mcl, "CONSTRUCTORES", 4, 302.0,  2,  4,  1);
        saveClasificacion(t2023, null, amf, "CONSTRUCTORES", 5, 280.0,  0, 10,  0);
    }

    // -------------------------------------------------------------------------
    // Helper methods
    // -------------------------------------------------------------------------

    private Rol saveRol(String nombre, String descripcion) {
        Rol rol = new Rol();
        rol.setNombre(nombre);
        rol.setDescripcion(descripcion);
        return rolRepository.save(rol);
    }

    private Piloto savePiloto(String tipoDoc, String numDoc, String nombre, String apellidos,
                               LocalDate fechaNac, String nacionalidad, int numero, String alias) {
        PersonaId id = new PersonaId(tipoDoc, numDoc);

        Persona persona = new Persona();
        persona.setId(id);
        persona.setNombre(nombre);
        persona.setApellidos(apellidos);
        persona.setFechaNacimiento(fechaNac);
        persona.setNacionalidad(nacionalidad);
        persona.setEstado("ACTIVO");
        persona = personaRepository.save(persona);

        Piloto piloto = new Piloto();
        piloto.setId(id);
        piloto.setPersona(persona);
        piloto.setNumParrillaPermanente(numero);
        piloto.setAlias(alias);
        piloto.setEstado("ACTIVO");
        return pilotoRepository.save(piloto);
    }

    private Escuderia saveEscuderia(String nombreOficial, String codigo, String nacionalidad,
                                     String paisSede, String ciudadSede) {
        Escuderia e = new Escuderia();
        e.setNombreOficial(nombreOficial);
        e.setCodigo(codigo);
        e.setNacionalidad(nacionalidad);
        e.setPaisSede(paisSede);
        e.setCiudadSede(ciudadSede);
        e.setEstado("ACTIVO");
        return escuderiaRepository.save(e);
    }

    private void saveContrato(Piloto piloto, Escuderia escuderia, LocalDate inicio) {
        Contrato c = new Contrato();
        c.setPiloto(piloto);
        c.setEscuderia(escuderia);
        c.setFechaInicio(inicio);
        c.setFechaFin(null);
        contratoRepository.save(c);
    }

    private Circuito saveCircuito(String nombre, String pais, String ciudad) {
        Circuito c = new Circuito();
        c.setNombreOficial(nombre);
        c.setPais(pais);
        c.setCiudad(ciudad);
        c.setEstado("ACTIVO");
        return circuitoRepository.save(c);
    }

    private VarianteCircuito saveVariante(Circuito circuito, int anioDesde, Integer anioHasta,
                                           String tipoCircuito, BigDecimal longKm,
                                           int numCurvas, String sentido) {
        VarianteCircuito v = new VarianteCircuito();
        v.setCircuito(circuito);
        v.setAnioDesde(anioDesde);
        v.setAnioHasta(anioHasta);
        v.setTipoCircuito(tipoCircuito);
        v.setLongitudKm(longKm);
        v.setNumCurvas(numCurvas);
        v.setSentido(sentido);
        return varianteCircuitoRepository.save(v);
    }

    private GranPremio saveGranPremio(Temporada temporada, VarianteCircuito variante,
                                       String nombre, int ronda,
                                       LocalDate inicio, LocalDate fin) {
        GranPremio gp = new GranPremio();
        gp.setTemporada(temporada);
        gp.setVariante(variante);
        gp.setNombreOficial(nombre);
        gp.setNumRonda(ronda);
        gp.setFechaInicio(inicio);
        gp.setFechaFin(fin);
        gp.setEstado("FINALIZADO");
        return granPremioRepository.save(gp);
    }

    private Sesion saveSesion(GranPremio gp, String tipo, int orden, LocalDate fecha, String condicion) {
        Sesion s = new Sesion();
        s.setGranPremio(gp);
        s.setTipoSesion(tipo);
        s.setOrden(orden);
        s.setFechaProgramada(fecha);
        s.setEstado("FINALIZADA");
        s.setCondicionPista(condicion);
        return sesionRepository.save(s);
    }

    private void saveResultadoCarrera(Sesion sesion, Piloto piloto, Contrato contrato,
                                       int posicion, double puntos, int vueltas,
                                       String tiempo, int posSalida) {
        ResultadoCarrera r = new ResultadoCarrera();
        r.setSesion(sesion);
        r.setPiloto(piloto);
        r.setContrato(contrato);
        r.setPosicionFinal(posicion);
        r.setPuntos(BigDecimal.valueOf(puntos));
        r.setVueltasCompletadas(vueltas);
        r.setTiempoTotal(tiempo);
        r.setEstadoFinalizacion("FINALIZADO");
        r.setPosSalida(posSalida);
        r.setVueltaRapida(false);
        resultadoCarreraRepository.save(r);
    }

    private void saveResultadoClasificacion(Sesion sesion, Piloto piloto, int posicion,
                                              String q1, String q2, String q3) {
        ResultadoClasificacion rc = new ResultadoClasificacion();
        rc.setSesion(sesion);
        rc.setPiloto(piloto);
        rc.setPosicionParrilla(posicion);
        rc.setTiempoQ1(q1);
        rc.setTiempoQ2(q2);
        rc.setTiempoQ3(q3);
        resultadoClasificacionRepository.save(rc);
    }

    private void saveClasificacion(Temporada temporada, Piloto piloto, Escuderia escuderia,
                                    String tipo, int posicion, double puntos,
                                    int victorias, int podios, int poles) {
        ClasificacionCampeonato cc = new ClasificacionCampeonato();
        cc.setTemporada(temporada);
        cc.setPiloto(piloto);
        cc.setEscuderia(escuderia);
        cc.setTipo(tipo);
        cc.setPosicion(posicion);
        cc.setPuntosTotales(BigDecimal.valueOf(puntos));
        cc.setVictorias(victorias);
        cc.setPodios(podios);
        cc.setPoles(poles);
        clasificacionCampeonatoRepository.save(cc);
    }

    private Contrato findContrato(Piloto piloto) {
        return contratoRepository.findByPilotoIdAndFechaFinIsNull(piloto.getId()).orElse(null);
    }
}
