<?xml version="1.0" encoding="UTF-8"?>
<!-- UVL: French version of the module's defaultEncounterFormFopStylesheet.xsl (patientdocuments 1.2.0), #940.
     Differences: header and footer labels in French; form title from the form French translation;
     "Printed by" shows the print time only (the module names the daemon user of the async job);
     unanswered questions and groups whose questions are all unanswered are left out;
     standalone info texts (markdown/label questions that head no question, e.g. a hidden-message
     shown only when a condition holds, which the module cannot evaluate) and sections or pages with
     no question at all are left out; whole-number answers print without a trailing ,0 / .0. -->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:fo="http://www.w3.org/1999/XSL/Format">

    <xsl:template match="/">
        <fo:root font-family="IBM Plex Sans Arabic">
            <fo:layout-master-set>
                <fo:simple-page-master master-name="A4-with-logo" page-height="29.7cm" page-width="21cm" margin="1.5cm">
                    <fo:region-body margin-top="0.5cm" margin-bottom="1.5cm"/>
                    <fo:region-before extent="0.5cm"/>
                    <fo:region-after extent="1.5cm"/>
                </fo:simple-page-master>
                <fo:simple-page-master master-name="A4" page-height="29.7cm" page-width="21cm" margin="1.5cm">
                    <fo:region-body margin-top="2.5cm" margin-bottom="1.5cm"/>
                    <fo:region-before extent="2.5cm"/>
                    <fo:region-after extent="1.5cm"/>
                </fo:simple-page-master>
            </fo:layout-master-set>

            <xsl:apply-templates select="encounters/encounter"/>
        </fo:root>
    </xsl:template>

    <xsl:template name="formTitle">
        <xsl:param name="n"/>
        <xsl:choose>
            <xsl:when test="$n='UVL 24-Hour Surveillance Form'">Surveillance des 24 heures</xsl:when>
            <xsl:when test="$n='UVL ANC Consultation Form'">Consultation prénatale (CPN)</xsl:when>
            <xsl:when test="$n='UVL Admission Note Form'">Fiche d'admission en hospitalisation</xsl:when>
            <xsl:when test="$n='UVL Anaesthesia Monitoring Form'">Surveillance pendant l'anesthésie (12 mesures, ancien)</xsl:when>
            <xsl:when test="$n='UVL Anaesthesia Reading Form'">Mesure d'anesthésie (une à la fois)</xsl:when>
            <xsl:when test="$n='UVL Anaesthesia Report Form'">Rapport d'anesthésie</xsl:when>
            <xsl:when test="$n='UVL Childbirth Record Form'">Dossier d'accouchement</xsl:when>
            <xsl:when test="$n='UVL Contact Form'">Fiche d'enregistrement d'un contact</xsl:when>
            <xsl:when test="$n='UVL Delivery Registration Form'">Enregistrement de l'accouchement</xsl:when>
            <xsl:when test="$n='UVL Discharge Summary Form'">Synthèse de sortie d'hospitalisation</xsl:when>
            <xsl:when test="$n='UVL Gynaecology Ultrasound Form'">Échographie obstétricale</xsl:when>
            <xsl:when test="$n='UVL IPD Follow-up (Doctor) Form'">Suivi d'hospitalisation (médecin)</xsl:when>
            <xsl:when test="$n='UVL IPD Follow-up (Nurse) Form'">Suivi d'hospitalisation (infirmier)</xsl:when>
            <xsl:when test="$n='UVL IPD Monitoring Form'">Protocole de surveillance globale</xsl:when>
            <xsl:when test="$n='UVL Inpatient Consultation Form'">Consultation en hospitalisation</xsl:when>
            <xsl:when test="$n='UVL Inpatient Follow-up Form'">Suivi d'hospitalisation (ancien)</xsl:when>
            <xsl:when test="$n='UVL Maternity Consultation Form'">Dossier obstétrical</xsl:when>
            <xsl:when test="$n='UVL Operation Protocol Form'">Protocole opératoire</xsl:when>
            <xsl:when test="$n='UVL Outpatient Consultation Form'">Consultation externe</xsl:when>
            <xsl:when test="$n='UVL Partograph Reading Form'">Lecture du partogramme</xsl:when>
            <xsl:when test="$n='UVL Pre-operative Record Form'">Consultation pré-anesthésique</xsl:when>
            <xsl:when test="$n='Ward Admission'">Admission en service</xsl:when>
            <xsl:otherwise><xsl:value-of select="$n"/></xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="encounter">
        <xsl:choose>
            <xsl:when test="logo">
                <fo:page-sequence master-reference="A4-with-logo">
                    <fo:static-content flow-name="xsl-region-before">
                        <fo:block/>
                    </fo:static-content>

                    <fo:static-content flow-name="xsl-region-after">
                        <fo:block text-align="center" border-top="0.5pt solid #eee" padding-top="2mm">
                            <fo:block font-size="8pt" color="#777" margin-bottom="1mm">
                                Imprimé le <xsl:value-of select="substring-after(printedBy, ' at ')"/>
                            </fo:block>
                            <xsl:if test="customFooterText">
                                <fo:block font-size="8pt" color="#777" margin-bottom="1mm">
                                    <xsl:value-of select="customFooterText"/>
                                </fo:block>
                            </xsl:if>
                            <fo:block font-size="8pt" color="#999">
                                Page <fo:page-number/>
                            </fo:block>
                        </fo:block>
                    </fo:static-content>

                    <fo:flow flow-name="xsl-region-body">
                        <fo:block text-align="center" margin-bottom="4mm">
                            <fo:external-graphic width="100mm" height="25mm" content-width="scale-down-to-fit" content-height="scale-down-to-fit">
                                <xsl:attribute name="src"><xsl:value-of select="logo"/></xsl:attribute>
                            </fo:external-graphic>
                        </fo:block>

                        <xsl:if test="patientName or location or visitDate or encounterDate or visitStartDate or visitEndDate or visitType or formNameInHeader or patientIdentifiers or personAttributes or visitAttributes">
                            <fo:table width="100%" table-layout="fixed" margin-bottom="4mm">
                                <fo:table-column column-width="50%"/>
                                <fo:table-column column-width="50%"/>
                                <fo:table-body>
                                    <fo:table-row>
                                        <fo:table-cell>
                                            <xsl:if test="patientName">
                                                <fo:block font-weight="bold" font-size="12pt">Nom du patient : <xsl:value-of select="patientName"/></fo:block>
                                            </xsl:if>
                                            <xsl:if test="location">
                                                <fo:block>Lieu : <xsl:value-of select="location"/></fo:block>
                                            </xsl:if>
                                            <xsl:if test="visitStartDate">
                                                <fo:block>Début de visite : <xsl:value-of select="visitStartDate"/></fo:block>
                                            </xsl:if>
                                            <xsl:if test="personAttributes">
                                                <xsl:for-each select="personAttributes/attribute">
                                                    <fo:block><xsl:value-of select="@type"/>: <xsl:value-of select="."/></fo:block>
                                                </xsl:for-each>
                                            </xsl:if>
                                            <xsl:if test="formNameInHeader">
                                                <fo:block>Formulaire : <xsl:call-template name="formTitle"><xsl:with-param name="n" select="formName"/></xsl:call-template></fo:block>
                                            </xsl:if>
                                        </fo:table-cell>
                                        <fo:table-cell text-align="right">
                                            <xsl:if test="encounterDate">
                                                <fo:block>Date de la consultation : <xsl:value-of select="encounterDate"/></fo:block>
                                            </xsl:if>
                                            <xsl:if test="visitEndDate">
                                                <fo:block>Fin de visite : <xsl:value-of select="visitEndDate"/></fo:block>
                                            </xsl:if>
                                            <xsl:if test="visitType">
                                                <fo:block>Type de visite : <xsl:value-of select="visitType"/></fo:block>
                                            </xsl:if>
                                            <xsl:if test="patientIdentifiers">
                                                <xsl:for-each select="patientIdentifiers/identifier">
                                                    <fo:block><xsl:value-of select="@type"/>: <xsl:value-of select="."/></fo:block>
                                                </xsl:for-each>
                                            </xsl:if>
                                            <xsl:if test="visitAttributes">
                                                <xsl:for-each select="visitAttributes/attribute">
                                                    <fo:block><xsl:value-of select="@type"/>: <xsl:value-of select="."/></fo:block>
                                                </xsl:for-each>
                                            </xsl:if>
                                        </fo:table-cell>
                                    </fo:table-row>
                                </fo:table-body>
                            </fo:table>
                        </xsl:if>

                        <fo:block font-size="16pt" font-weight="bold" text-align="center" margin-top="4mm" margin-bottom="8mm" color="#2c3e50">
                            <xsl:call-template name="formTitle"><xsl:with-param name="n" select="formName"/></xsl:call-template>
                        </fo:block>

                        <xsl:apply-templates select="pages/page"/>
                    </fo:flow>
                </fo:page-sequence>
            </xsl:when>
            <xsl:otherwise>
                <fo:page-sequence master-reference="A4">
                    <fo:static-content flow-name="xsl-region-before">
                        <xsl:variable name="hasHeader" select="patientName or location or visitDate or encounterDate or visitStartDate or visitEndDate or visitType or formNameInHeader or patientIdentifiers or personAttributes or visitAttributes"/>
                        <fo:block border-bottom="1pt solid #ccc" padding-bottom="2mm" font-size="10pt" color="#555">
                            <xsl:if test="$hasHeader">
                                <fo:table width="100%" table-layout="fixed">
                                    <fo:table-column column-width="50%"/>
                                    <fo:table-column column-width="50%"/>
                                    <fo:table-body>
                                        <fo:table-row>
                                            <fo:table-cell>
                                                <xsl:if test="patientName">
                                                    <fo:block font-weight="bold" font-size="12pt">Nom du patient : <xsl:value-of select="patientName"/></fo:block>
                                                </xsl:if>
                                                <xsl:if test="location">
                                                    <fo:block>Lieu : <xsl:value-of select="location"/></fo:block>
                                                </xsl:if>
                                                <xsl:if test="visitStartDate">
                                                    <fo:block>Début de visite : <xsl:value-of select="visitStartDate"/></fo:block>
                                                </xsl:if>
                                                <xsl:if test="personAttributes">
                                                    <xsl:for-each select="personAttributes/attribute">
                                                        <fo:block><xsl:value-of select="@type"/>: <xsl:value-of select="."/></fo:block>
                                                    </xsl:for-each>
                                                </xsl:if>
                                                <xsl:if test="formNameInHeader">
                                                    <fo:block>Formulaire : <xsl:call-template name="formTitle"><xsl:with-param name="n" select="formName"/></xsl:call-template></fo:block>
                                                </xsl:if>
                                            </fo:table-cell>
                                            <fo:table-cell text-align="right">
                                                <xsl:if test="visitDate">
                                                    <fo:block>Date de visite : <xsl:value-of select="visitDate"/></fo:block>
                                                </xsl:if>
                                                <xsl:if test="encounterDate">
                                                    <fo:block>Date de la consultation : <xsl:value-of select="encounterDate"/></fo:block>
                                                </xsl:if>
                                                <xsl:if test="visitEndDate">
                                                    <fo:block>Fin de visite : <xsl:value-of select="visitEndDate"/></fo:block>
                                                </xsl:if>
                                                <xsl:if test="visitType">
                                                    <fo:block>Type de visite : <xsl:value-of select="visitType"/></fo:block>
                                                </xsl:if>
                                                <xsl:if test="patientIdentifiers">
                                                    <xsl:for-each select="patientIdentifiers/identifier">
                                                        <fo:block><xsl:value-of select="@type"/>: <xsl:value-of select="."/></fo:block>
                                                    </xsl:for-each>
                                                </xsl:if>
                                                <xsl:if test="visitAttributes">
                                                    <xsl:for-each select="visitAttributes/attribute">
                                                        <fo:block><xsl:value-of select="@type"/>: <xsl:value-of select="."/></fo:block>
                                                    </xsl:for-each>
                                                </xsl:if>
                                            </fo:table-cell>
                                        </fo:table-row>
                                    </fo:table-body>
                                </fo:table>
                            </xsl:if>
                        </fo:block>
                    </fo:static-content>

                    <fo:static-content flow-name="xsl-region-after">
                        <fo:block text-align="center" border-top="0.5pt solid #eee" padding-top="2mm">
                            <fo:block font-size="8pt" color="#777" margin-bottom="1mm">
                                Imprimé le <xsl:value-of select="substring-after(printedBy, ' at ')"/>
                            </fo:block>
                            <xsl:if test="customFooterText">
                                <fo:block font-size="8pt" color="#777" margin-bottom="1mm">
                                    <xsl:value-of select="customFooterText"/>
                                </fo:block>
                            </xsl:if>
                            <fo:block font-size="8pt" color="#999">
                                Page <fo:page-number/>
                            </fo:block>
                        </fo:block>
                    </fo:static-content>

                    <fo:flow flow-name="xsl-region-body">
                        <fo:block font-size="16pt" font-weight="bold" text-align="center" margin-top="4mm" margin-bottom="8mm" color="#2c3e50">
                            <xsl:call-template name="formTitle"><xsl:with-param name="n" select="formName"/></xsl:call-template>
                        </fo:block>

                        <xsl:apply-templates select="pages/page"/>
                    </fo:flow>
                </fo:page-sequence>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="page">
        <xsl:if test="section/question">
        <fo:block margin-bottom="5mm">
            <xsl:if test="@label">
                <fo:block font-size="13pt" font-weight="bold" color="#005f87" margin-top="4mm" margin-bottom="2mm"
                          border-bottom="0.5pt solid #005f87" keep-with-next.within-page="always">
                    <xsl:value-of select="@label"/>
                </fo:block>
            </xsl:if>

            <xsl:apply-templates select="section"/>
        </fo:block>
        </xsl:if>
    </xsl:template>

    <xsl:template match="section">
        <xsl:if test="question">
        <fo:block margin-left="2mm" margin-bottom="4mm">
            <xsl:if test="@label != ''">
                <fo:block font-size="11pt" font-weight="bold" background-color="#eef" padding="1mm" margin-bottom="2mm"
                          keep-with-next.within-page="always">
                    <xsl:value-of select="@label"/>
                </fo:block>
            </xsl:if>

            <xsl:choose>
                <xsl:when test="question[not(. = 'No data recorded')]">
                    <fo:table width="100%" table-layout="fixed">
                        <fo:table-column column-width="60%"/>
                        <fo:table-column column-width="40%"/>
                        <fo:table-body>
                            <xsl:apply-templates select="question[not(. = 'No data recorded')] | markdown"/>
                        </fo:table-body>
                    </fo:table>
                </xsl:when>
                <xsl:otherwise>
                    <fo:block font-size="9pt" font-style="italic" color="#888" margin-left="2mm" padding="1mm">
                        Aucune donnée enregistrée pour cette section.
                    </fo:block>
                </xsl:otherwise>
            </xsl:choose>
        </fo:block>
        </xsl:if>
    </xsl:template>

    <!-- 28,0 / 1250,0 / 28.0 -> 28 / 1250 / 28; real decimals and any other text are kept as is -->
    <xsl:template name="plainNumber">
        <xsl:param name="v"/>
        <xsl:choose>
            <xsl:when test="$v != '' and translate($v, '0123456789', '') = ',' and substring($v, 1, 1) != ','
                            and substring-after($v, ',') != '' and translate(substring-after($v, ','), '0', '') = ''">
                <xsl:value-of select="substring-before($v, ',')"/>
            </xsl:when>
            <xsl:when test="$v != '' and translate($v, '0123456789', '') = '.' and substring($v, 1, 1) != '.'
                            and substring-after($v, '.') = '0'">
                <xsl:value-of select="substring-before($v, '.')"/>
            </xsl:when>
            <xsl:otherwise><xsl:value-of select="$v"/></xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <xsl:template match="question">
        <fo:table-row keep-together.within-page="always">
            <fo:table-cell padding="1.5mm" border-bottom="0.5pt solid #eee">
                <fo:block font-size="10pt" color="#333">
                    <xsl:value-of select="@label"/>
                </fo:block>
            </fo:table-cell>

            <fo:table-cell padding="1.5mm" border-bottom="0.5pt solid #eee" background-color="#fafafa">
                <fo:block font-size="10pt" font-weight="bold" color="black">
                    <xsl:call-template name="plainNumber"><xsl:with-param name="v" select="string(.)"/></xsl:call-template>
                </fo:block>
            </fo:table-cell>
        </fo:table-row>
    </xsl:template>

    <xsl:template match="markdown">
        <xsl:variable name="me" select="generate-id()"/>
        <xsl:variable name="inGroup" select="count(following-sibling::question[generate-id(preceding-sibling::markdown[1]) = $me])"/>
        <xsl:variable name="answered" select="count(following-sibling::question[generate-id(preceding-sibling::markdown[1]) = $me][not(. = 'No data recorded')])"/>
        <xsl:if test="$answered &gt; 0">
        <fo:table-row>
            <fo:table-cell number-columns-spanned="2" padding="2mm">
                <fo:block font-size="9pt" font-style="italic" color="#666" background-color="#ffffee" border="0.5pt dashed #ccc" padding="2mm">
                    <xsl:value-of select="."/>
                </fo:block>
            </fo:table-cell>
        </fo:table-row>
        </xsl:if>
    </xsl:template>

</xsl:stylesheet>